import cv2
import numpy as np
import os

RUN_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\2d8cecee-fb6a-4d2c-82b9-74b5d1dbbc88\runner_run_cycle_1792071333961.jpg"
JUMP_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\2d8cecee-fb6a-4d2c-82b9-74b5d1dbbc88\runner_jump_actions_1792071360821.jpg"
IDLE_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\2d8cecee-fb6a-4d2c-82b9-74b5d1dbbc88\runner_idle_crash_1792071392256.jpg"
OUT_DIR = r"e:\port me\public\sprites\runner"

os.makedirs(OUT_DIR, exist_ok=True)

def remove_background(img_bgr):
    # Convert to BGRA
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    
    # Solid foreground mask where pixel is clearly non-white
    # Character has dark hair, dark hoodie, yellow scarf, etc.
    # The background is pure white ~250-255.
    alpha = np.zeros_like(gray, dtype=np.float32)
    
    # Sharp cut with anti-aliasing margin
    white_thresh = 246
    dark_thresh = 215
    
    alpha[gray <= dark_thresh] = 255.0
    ramp_mask = (gray > dark_thresh) & (gray < white_thresh)
    alpha[ramp_mask] = 255.0 * (white_thresh - gray[ramp_mask].astype(np.float32)) / (white_thresh - dark_thresh)
    alpha[gray >= white_thresh] = 0.0
    
    alpha = np.clip(alpha, 0, 255).astype(np.uint8)
    
    b, g, r = cv2.split(img_bgr)
    return cv2.merge([b, g, r, alpha])

print("Background removal ready")
