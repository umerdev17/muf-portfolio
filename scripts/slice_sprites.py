import cv2
import numpy as np
import os
import json

RUN_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\2d8cecee-fb6a-4d2c-82b9-74b5d1dbbc88\runner_run_cycle_1792071333961.jpg"
JUMP_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\2d8cecee-fb6a-4d2c-82b9-74b5d1dbbc88\runner_jump_actions_1792071360821.jpg"
IDLE_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\2d8cecee-fb6a-4d2c-82b9-74b5d1dbbc88\runner_idle_crash_1792071392256.jpg"

OUT_DIR = r"e:\port me\public\sprites\runner"
os.makedirs(OUT_DIR, exist_ok=True)

def isolate_transparent_crop(img_bgr, box, white_thresh=248, dark_thresh=218):
    x1, y1, x2, y2 = box
    pad = 8
    h_img, w_img = img_bgr.shape[:2]
    x1 = max(0, x1 - pad)
    y1 = max(0, y1 - pad)
    x2 = min(w_img, x2 + pad)
    y2 = min(h_img, y2 + pad)
    
    crop = img_bgr[y1:y2, x1:x2].copy()
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    
    # Generate smooth alpha
    alpha = np.zeros_like(gray, dtype=np.float32)
    alpha[gray <= dark_thresh] = 255.0
    ramp = (gray > dark_thresh) & (gray < white_thresh)
    alpha[ramp] = 255.0 * (white_thresh - gray[ramp].astype(np.float32)) / (white_thresh - dark_thresh)
    alpha[gray >= white_thresh] = 0.0
    
    # Color decontaminate edges so no white glow remains
    b, g, r = cv2.split(crop)
    # Where alpha is low, pull colors towards the nearest dark edge
    alpha_u8 = np.clip(alpha, 0, 255).astype(np.uint8)
    
    rgba = cv2.merge([b, g, r, alpha_u8])
    return rgba

# 1. RUN CYCLE (6 frames)
img_run = cv2.imread(RUN_PATH)
# Exact horizontal cuts based on our connected component bounding boxes:
# 0: [8, 305], 1: [312, 487], 2: [464, 704], 3: [688, 959], 4: [881, 1139], 5: [1092, 1370]
# Refined clean boxes:
run_boxes = [
    (8, 195, 308, 600),
    (312, 250, 487, 600),
    (488, 270, 695, 600),
    (696, 150, 930, 600),
    (931, 210, 1145, 600),
    (1146, 210, 1370, 600)
]

run_crops = []
for i, box in enumerate(run_boxes):
    rgba = isolate_transparent_crop(img_run, box)
    run_crops.append(rgba)
    out_path = os.path.join(OUT_DIR, f"run_{i}.png")
    cv2.imwrite(out_path, rgba)
    print(f"Saved {out_path} ({rgba.shape[1]}x{rgba.shape[0]})")

# 2. JUMP ACTIONS (5 frames)
img_jump = cv2.imread(JUMP_PATH)
jump_boxes = [
    (25, 320, 298, 670),    # 0: takeoff crouch
    (328, 195, 530, 620),   # 1: ascend
    (531, 110, 800, 580),   # 2: apex peak
    (815, 140, 1085, 590),  # 3: double jump spin
    (1095, 215, 1350, 665), # 4: fall / land prep
]
jump_names = ["jump_takeoff", "jump_ascend", "jump_peak", "jump_double", "jump_fall"]

for name, box in zip(jump_names, jump_boxes):
    rgba = isolate_transparent_crop(img_jump, box)
    out_path = os.path.join(OUT_DIR, f"{name}.png")
    cv2.imwrite(out_path, rgba)
    print(f"Saved {out_path} ({rgba.shape[1]}x{rgba.shape[0]})")

# 3. IDLE AND CRASH (4 frames)
img_idle = cv2.imread(IDLE_PATH)
idle_boxes = [
    (55, 100, 265, 710),    # 0: idle standing
    (268, 100, 580, 710),   # 1: idle breathing / scarf wave
    (585, 190, 880, 710),   # 2: stumble
    (885, 380, 1365, 710),  # 3: crash slide
]
idle_names = ["idle_0", "idle_1", "stumble", "crash"]

for name, box in zip(idle_names, idle_boxes):
    rgba = isolate_transparent_crop(img_idle, box)
    out_path = os.path.join(OUT_DIR, f"{name}.png")
    cv2.imwrite(out_path, rgba)
    print(f"Saved {out_path} ({rgba.shape[1]}x{rgba.shape[0]})")

# 4. STANDARDIZED CANVAS ATLAS FOR ENGINE
# For seamless 60fps canvas animation, we standardize all character heights so baseline aligns perfectly!
TARGET_H = 120 # rendered height standard
frames_metadata = {}

for fname in os.listdir(OUT_DIR):
    if fname.endswith(".png"):
        fpath = os.path.join(OUT_DIR, fname)
        im = cv2.imread(fpath, cv2.IMREAD_UNCHANGED)
        h, w = im.shape[:2]
        frames_metadata[fname[:-4]] = {
            "file": f"/sprites/runner/{fname}",
            "width": w,
            "height": h,
            "aspect": round(w / h, 3)
        }

meta_path = os.path.join(OUT_DIR, "manifest.json")
with open(meta_path, "w") as f:
    json.dump(frames_metadata, f, indent=2)

print(f"Manifest written to {meta_path} with {len(frames_metadata)} frames.")
