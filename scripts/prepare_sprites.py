import cv2
import numpy as np
import os
import json

IN_DIR = r"e:\port me\public\sprites\runner"
OUT_DIR = r"e:\port me\public\sprites\runner"

manifest = {}

for fname in sorted(os.listdir(IN_DIR)):
    if fname.endswith(".png") and not fname.startswith("tight_"):
        fpath = os.path.join(IN_DIR, fname)
        im = cv2.imread(fpath, cv2.IMREAD_UNCHANGED)
        if im is None or im.shape[2] != 4:
            continue
            
        alpha = im[:, :, 3]
        rows = np.where(alpha > 18)[0]
        cols = np.where(alpha > 18)[1]
        
        if len(rows) == 0 or len(cols) == 0:
            continue
            
        ymin, ymax = int(np.min(rows)), int(np.max(rows))
        xmin, xmax = int(np.min(cols)), int(np.max(cols))
        
        # Add 2px margin
        h_im, w_im = im.shape[:2]
        ymin = max(0, ymin - 2)
        ymax = min(h_im - 1, ymax + 2)
        xmin = max(0, xmin - 2)
        xmax = min(w_im - 1, xmax + 2)
        
        cropped = im[ymin:ymax+1, xmin:xmax+1].copy()
        
        # Subtle fringe cleanup: for any pixel where alpha < 240, check if RGB is near white
        # If so, replace with the darker edge color to prevent white halos on dark themes
        b, g, r, a = cv2.split(cropped)
        near_white_edge = (a < 235) & (r > 200) & (g > 200) & (b > 200)
        # Shift edge towards dark outline
        r[near_white_edge] = (r[near_white_edge] * 0.4).astype(np.uint8)
        g[near_white_edge] = (g[near_white_edge] * 0.4).astype(np.uint8)
        b[near_white_edge] = (b[near_white_edge] * 0.4).astype(np.uint8)
        
        cleaned = cv2.merge([b, g, r, a])
        
        # Overwrite with tight, cleaned sprite
        cv2.imwrite(fpath, cleaned)
        
        h_cr, w_cr = cleaned.shape[:2]
        key = fname[:-4]
        manifest[key] = {
            "path": f"/sprites/runner/{fname}",
            "width": w_cr,
            "height": h_cr,
            "aspect": round(w_cr / h_cr, 3)
        }
        print(f"Tight cropped {fname:18s}: {w_cr}x{h_cr} (aspect: {manifest[key]['aspect']})")

with open(os.path.join(OUT_DIR, "manifest.json"), "w") as f:
    json.dump(manifest, f, indent=2)

print("Manifest successfully updated!")
