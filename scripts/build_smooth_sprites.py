import cv2
import numpy as np
import os
import json
from PIL import Image

RUN_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\2d8cecee-fb6a-4d2c-82b9-74b5d1dbbc88\runner_run_cycle_1792071333961.jpg"
JUMP_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\2d8cecee-fb6a-4d2c-82b9-74b5d1dbbc88\runner_jump_actions_1792071360821.jpg"
IDLE_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\2d8cecee-fb6a-4d2c-82b9-74b5d1dbbc88\runner_idle_crash_1792071392256.jpg"

OUT_DIR = r"e:\port me\public\sprites\runner"
os.makedirs(OUT_DIR, exist_ok=True)

def clean_character_mask_and_fringe(crop_bgr):
    """
    Flood fills the background from image borders, eliminates isolated stray noise speckles,
    and decontaminates edge fringe pixels so there are zero white halos.
    """
    ch, cw = crop_bgr.shape[:2]
    
    # 1. Flood fill from corners to find background
    flood_mask = np.zeros((ch + 2, cw + 2), np.uint8)
    bg_tested = crop_bgr.copy()
    
    # Fill from all 4 corners
    for seed in [(0, 0), (cw - 1, 0), (0, ch - 1), (cw - 1, ch - 1), (cw // 2, 0)]:
        if flood_mask[seed[1] + 1, seed[0] + 1] == 0:
            cv2.floodFill(
                bg_tested, flood_mask, seed, (0, 255, 0),
                (26, 26, 26), (26, 26, 26),
                cv2.FLOODFILL_FIXED_RANGE
            )
            
    is_bg = (bg_tested[:, :, 1] == 255) & (bg_tested[:, :, 0] == 0) & (bg_tested[:, :, 2] == 0)
    
    # Character mask (non-background)
    char_mask = (~is_bg).astype(np.uint8) * 255
    
    # 2. Filter out small stray components (< 150 px) to eliminate floating dust/speckles
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(char_mask)
    if num_labels > 1:
        areas = [stats[i, cv2.CC_STAT_AREA] for i in range(1, num_labels)]
        max_idx = np.argmax(areas) + 1
        cleaned_mask = np.zeros_like(char_mask)
        cleaned_mask[labels == max_idx] = 255
        
        for i in range(1, num_labels):
            if i == max_idx:
                continue
            area = stats[i, cv2.CC_STAT_AREA]
            left = stats[i, cv2.CC_STAT_LEFT]
            width = stats[i, cv2.CC_STAT_WIDTH]
            top = stats[i, cv2.CC_STAT_TOP]
            height = stats[i, cv2.CC_STAT_HEIGHT]
            cx, cy = centroids[i]
            
            # Check if it touches the left or right boundary of the crop
            touches_boundary = (left <= 2) or (left + width >= cw - 2)
            
            # If it touches boundary and is disconnected from main body, it is a neighbor character piece
            if touches_boundary:
                continue
                
            # Tiny noise speckles (< 80 px)
            if area < 80:
                continue
                
            # Keep legitimate internal / effect components (like dust puffs, jump double swooshes)
            cleaned_mask[labels == i] = 255
            
        char_mask = cleaned_mask
        
    # 3. Smooth anti-aliased edge generation
    # Distance transform from background
    dist_inside = cv2.distanceTransform(char_mask, cv2.DIST_L2, 3)
    dist_outside = cv2.distanceTransform(255 - char_mask, cv2.DIST_L2, 3)
    
    alpha = np.zeros((ch, cw), dtype=np.float32)
    alpha[char_mask == 255] = 255.0
    
    # Soft 1.5px transition at edges
    edge_zone = (dist_inside <= 2.0) & (char_mask == 255)
    alpha[edge_zone] = 128.0 + (dist_inside[edge_zone] / 2.0) * 127.0
    
    outer_edge = (dist_outside <= 1.2) & (char_mask == 0)
    alpha[outer_edge] = (1.0 - (dist_outside[outer_edge] / 1.2)) * 128.0
    
    # 4. Color decontamination:
    # Near edges where original RGB has blended with white background,
    # pull color towards nearest interior character pixel so outlines remain dark
    b, g, r = cv2.split(crop_bgr)
    
    # Find nearest solid pixel for fringe pixels
    solid_mask = (dist_inside > 2.0).astype(np.uint8)
    if np.any(solid_mask):
        # Inpainting / nearest neighbor propagation for edge colors
        inpaint_mask = ((alpha > 0) & (alpha < 250)).astype(np.uint8)
        # For fringe pixels that are too bright (whitish halo), shift towards outline
        fringe_mask = inpaint_mask & (r > 160) & (g > 160) & (b > 160)
        # Darken the white fringe to match black/dark line art
        r[fringe_mask > 0] = (r[fringe_mask > 0] * 0.25).astype(np.uint8)
        g[fringe_mask > 0] = (g[fringe_mask > 0] * 0.25).astype(np.uint8)
        b[fringe_mask > 0] = (b[fringe_mask > 0] * 0.25).astype(np.uint8)

    alpha_u8 = np.clip(alpha, 0, 255).astype(np.uint8)
    rgba = cv2.merge([b, g, r, alpha_u8])
    return rgba, char_mask

# =========================================================================
# 1. PROCESS RUNNING CYCLE WITH STANDARDIZED ANCHORING
# =========================================================================
img_run = cv2.imread(RUN_PATH)

run_boxes = [
    (8, 140, 312, 605),
    (312, 140, 488, 605),
    (488, 140, 696, 605),
    (696, 140, 931, 605),
    (850, 140, 1146, 605),
    (1146, 140, 1370, 605)
]

# Torso X offsets relative to each box
torso_local_cx = [171, 77, 117, 132, 173, 95]
ground_y_orig = 590 # Original artwork baseline

# Standardized Canvas Dimensions
CANVAS_W = 560
CANVAS_H = 680
ANCHOR_X = 280 # Torso center in standardized canvas
ANCHOR_GROUND_Y = 630 # Ground baseline in standardized canvas

run_standard_frames = []

for idx, ((x1, y1, x2, y2), tcx) in enumerate(zip(run_boxes, torso_local_cx)):
    crop = img_run[y1:y2, x1:x2].copy()
    rgba_crop, _ = clean_character_mask_and_fringe(crop)
    
    # Create standardized transparent canvas
    canvas = np.zeros((CANVAS_H, CANVAS_W, 4), dtype=np.uint8)
    
    # Calculate placement so torso is at ANCHOR_X and ground is at ANCHOR_GROUND_Y
    place_x = ANCHOR_X - tcx
    place_y = ANCHOR_GROUND_Y - (ground_y_orig - y1)
    
    crop_h, crop_w = rgba_crop.shape[:2]
    
    # Source and destination slicing with bounds clipping
    src_x1 = max(0, -place_x)
    src_y1 = max(0, -place_y)
    dst_x1 = max(0, place_x)
    dst_y1 = max(0, place_y)
    
    paste_w = min(crop_w - src_x1, CANVAS_W - dst_x1)
    paste_h = min(crop_h - src_y1, CANVAS_H - dst_y1)
    
    if paste_w > 0 and paste_h > 0:
        canvas[dst_y1:dst_y1+paste_h, dst_x1:dst_x1+paste_w] = rgba_crop[src_y1:src_y1+paste_h, src_x1:src_x1+paste_w]
        
    out_file = os.path.join(OUT_DIR, f"run_{idx}.png")
    cv2.imwrite(out_file, canvas)
    run_standard_frames.append(canvas)
    print(f"Exported standardized run_{idx}.png ({CANVAS_W}x{CANVAS_H})")

# Generate GIF preview to inspect loop visually
pil_frames = []
for f in run_standard_frames:
    b, g, r, a = cv2.split(f)
    rgb = cv2.merge([r, g, b])
    # Composite on warm cream background for preview
    cream_bg = Image.new("RGBA", (CANVAS_W, CANVAS_H), (247, 245, 238, 255))
    char_pil = Image.fromarray(cv2.merge([r, g, b, a]))
    cream_bg.paste(char_pil, (0, 0), char_pil)
    pil_frames.append(cream_bg)

gif_path = os.path.join(OUT_DIR, "preview_run.gif")
pil_frames[0].save(
    gif_path,
    save_all=True,
    append_images=pil_frames[1:],
    duration=95, # ~10.5 fps
    loop=0
)
print(f"Saved animated preview: {gif_path}")

# =========================================================================
# 2. PROCESS JUMP ACTIONS WITH STANDARDIZED CANVAS
# =========================================================================
img_jump = cv2.imread(JUMP_PATH)
jump_boxes = [
    (25, 300, 305, 670),    # takeoff
    (325, 180, 530, 630),   # ascend
    (530, 100, 805, 590),   # peak
    (815, 120, 1085, 590),  # double
    (1095, 200, 1350, 670), # fall
]
jump_names = ["jump_takeoff", "jump_ascend", "jump_peak", "jump_double", "jump_fall"]
jump_torso_cx = [140, 100, 135, 135, 125]
jump_ground_y = 660

for name, box, tcx in zip(jump_names, jump_boxes, jump_torso_cx):
    crop = img_jump[box[1]:box[3], box[0]:box[2]].copy()
    rgba_crop, _ = clean_character_mask_and_fringe(crop)
    
    canvas = np.zeros((CANVAS_H, CANVAS_W, 4), dtype=np.uint8)
    place_x = ANCHOR_X - tcx
    place_y = ANCHOR_GROUND_Y - (jump_ground_y - box[1])
    
    crop_h, crop_w = rgba_crop.shape[:2]
    src_x1 = max(0, -place_x)
    src_y1 = max(0, -place_y)
    dst_x1 = max(0, place_x)
    dst_y1 = max(0, place_y)
    paste_w = min(crop_w - src_x1, CANVAS_W - dst_x1)
    paste_h = min(crop_h - src_y1, CANVAS_H - dst_y1)
    
    if paste_w > 0 and paste_h > 0:
        canvas[dst_y1:dst_y1+paste_h, dst_x1:dst_x1+paste_w] = rgba_crop[src_y1:src_y1+paste_h, src_x1:src_x1+paste_w]
        
    out_file = os.path.join(OUT_DIR, f"{name}.png")
    cv2.imwrite(out_file, canvas)
    print(f"Exported standardized {name}.png ({CANVAS_W}x{CANVAS_H})")

# =========================================================================
# 3. PROCESS IDLE AND CRASH WITH STANDARDIZED CANVAS
# =========================================================================
img_idle = cv2.imread(IDLE_PATH)
idle_boxes = [
    (55, 90, 268, 715),     # idle_0
    (268, 90, 580, 715),    # idle_1
    (580, 180, 1060, 715),  # stumble
    (850, 385, 1370, 715),  # crash
]
idle_names = ["idle_0", "idle_1", "stumble", "crash"]
idle_torso_cx = [105, 150, 200, 270]
idle_ground_y = 705

for name, box, tcx in zip(idle_names, idle_boxes, idle_torso_cx):
    crop = img_idle[box[1]:box[3], box[0]:box[2]].copy()
    if name == "stumble":
        # White out crash legs and dust from bottom-right of stumble crop
        crop[300:, 260:] = [255, 255, 255]
    elif name == "crash":
        # White out stumble hand from top-left of crash crop
        crop[:105, :210] = [255, 255, 255]

    rgba_crop, _ = clean_character_mask_and_fringe(crop)
    
    canvas = np.zeros((CANVAS_H, CANVAS_W, 4), dtype=np.uint8)
    place_x = ANCHOR_X - tcx
    place_y = ANCHOR_GROUND_Y - (idle_ground_y - box[1])
    
    crop_h, crop_w = rgba_crop.shape[:2]
    src_x1 = max(0, -place_x)
    src_y1 = max(0, -place_y)
    dst_x1 = max(0, place_x)
    dst_y1 = max(0, place_y)
    paste_w = min(crop_w - src_x1, CANVAS_W - dst_x1)
    paste_h = min(crop_h - src_y1, CANVAS_H - dst_y1)
    
    if paste_w > 0 and paste_h > 0:
        canvas[dst_y1:dst_y1+paste_h, dst_x1:dst_x1+paste_w] = rgba_crop[src_y1:src_y1+paste_h, src_x1:src_x1+paste_w]
        
    out_file = os.path.join(OUT_DIR, f"{name}.png")
    cv2.imwrite(out_file, canvas)
    print(f"Exported standardized {name}.png ({CANVAS_W}x{CANVAS_H})")

# =========================================================================
# 4. WRITE UPDATED UNIFIED MANIFEST
# =========================================================================
manifest = {}
all_sprites = [
    "run_0", "run_1", "run_2", "run_3", "run_4", "run_5",
    "jump_takeoff", "jump_ascend", "jump_peak", "jump_double", "jump_fall",
    "idle_0", "idle_1", "stumble", "crash"
]

for name in all_sprites:
    manifest[name] = {
        "path": f"/sprites/runner/{name}.png",
        "width": CANVAS_W,
        "height": CANVAS_H,
        "aspect": round(CANVAS_W / CANVAS_H, 3),
        "anchorX": ANCHOR_X,
        "groundY": ANCHOR_GROUND_Y
    }

manifest_path = os.path.join(OUT_DIR, "manifest.json")
with open(manifest_path, "w") as f:
    json.dump(manifest, f, indent=2)

print(f"Updated manifest.json with all {len(manifest)} standardized frames.")
