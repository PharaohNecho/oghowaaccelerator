import zlib
import struct
import math
import os

os.makedirs('public', exist_ok=True)

def create_png(width, height, get_pixel):
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # Filter 0
        for x in range(width):
            r, g, b, a = get_pixel(x, y)
            raw.extend([r, g, b, a])
    
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    png = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png += chunk(b'IHDR', ihdr)
    png += chunk(b'IDAT', zlib.compress(bytes(raw), 9))
    png += chunk(b'IEND', b'')
    return png

# Function to draw the Benin Queen Idia emblem at (cx, cy) with outer radius R_out
def draw_emblem_pixel(x, y, cx, cy, R_out, pillar_w, pillar_h):
    R_in = int(R_out * 0.68)
    R_mask = int(R_out * 0.60)

    # Top blue pillar
    if abs(x - cx) <= pillar_w // 2 and (cy - R_out - pillar_h) <= y <= (cy - R_out + 4):
        return 0x00, 0x1F, 0xD6, 255

    dist = math.sqrt((x - cx)**2 + (y - cy)**2)

    # Outside
    if dist > R_out + 0.8:
        return 0, 0, 0, 0
    if dist > R_out - 0.8:
        alpha = int(255 * max(0.0, min(1.0, R_out + 0.8 - dist)))
        return 0x00, 0x1F, 0xD6, alpha

    # Blue Ring
    if dist >= R_in:
        angle = math.atan2(y - cy, x - cx)
        # Top text "Oghowa"
        if -2.5 < angle < -0.6 and (R_in + 2) <= dist <= (R_out - 2):
            sector = int((angle + 2.5) * 8)
            if sector % 2 == 0 and (int(y) % 2 == 0):
                return 0xFF, 0xFF, 0xFF, 255
        # Bottom text "OUR OWN"
        if 0.8 < angle < 2.3 and (R_in + 2) <= dist <= (R_out - 2):
            sector = int((angle - 0.8) * 8)
            if sector % 2 == 0 and (int(y) % 2 == 0):
                return 0xFF, 0xFF, 0xFF, 255
        return 0x00, 0x1F, 0xD6, 255

    # White gap ring
    if dist >= R_mask:
        return 0xFF, 0xFF, 0xFF, 255

    # Face zone
    fx = (x - cx) / float(R_mask * 0.75)
    fy = (y - cy) / float(R_mask * 0.90)

    # Crown
    if -0.7 <= fx <= 0.7 and -0.85 <= fy <= -0.4:
        grid = (int(x + y) % 4 == 0) or (int(x - y) % 4 == 0)
        if grid:
            return 0x4A, 0x22, 0x0A, 255
        return 0xC8, 0x7A, 0x2E, 255

    # Face Oval
    f_dist = fx*fx + fy*fy
    if f_dist <= 0.75:
        # Forehead scarification
        if -0.35 <= fy <= -0.1 and abs(abs(fx) - 0.12) < 0.05:
            return 0x4A, 0x1E, 0x07, 255
        # Eyes
        if -0.05 <= fy <= 0.08 and 0.18 <= abs(fx) <= 0.45:
            eye_dist = ((abs(fx) - 0.31)**2) / 0.015 + ((fy - 0.01)**2) / 0.005
            if eye_dist <= 1.0:
                return 0x1E, 0x0D, 0x03, 255
            if eye_dist <= 1.6:
                return 0xF7, 0xBE, 0x82, 255
        # Nose
        if -0.1 <= fy <= 0.28 and abs(fx) <= 0.14:
            if fy > 0.2:
                return 0x6E, 0x33, 0x0D, 255
            return 0xBD, 0x6E, 0x27, 255
        # Lips
        if 0.35 <= fy <= 0.52 and abs(fx) <= 0.24:
            return 0x6E, 0x2A, 0x0A, 255

        # Bronze shade
        shade = 0.5 + 0.5 * (1.0 - math.sqrt(f_dist))
        return int(0xD8 * shade), int(0x82 * shade), int(0x35 * shade), 255

    # Neck collar
    if abs(fx) <= 0.55 and 0.55 <= fy <= 0.95:
        if int(y) % 3 == 0:
            return 0x4A, 0x22, 0x0A, 255
        return 0xB0, 0x66, 0x24, 255

    # Disc background
    return 0xF9, 0xF4, 0xEC, 255


# 1. Generate public/favicon.png (128x192)
def gen_fav():
    W, H = 128, 192
    cx, cy = 64, 126
    R_out = 56
    def get_pixel(x, y):
        return draw_emblem_pixel(x, y, cx, cy, R_out, 56, 45)
    return create_png(W, H, get_pixel)

with open('public/favicon.png', 'wb') as f:
    f.write(gen_fav())
print("public/favicon.png written successfully")


# 2. Generate public/logo.png (300x85)
# In logo.png, the emblem is on the left (cx=40, cy=52, R_out=28, pillar_h=20, pillar_w=28)
# And the text "OGHOWA" (blue) and "Our own" (red italic) is on the right.
# We render simple bitmap serif glyphs for the text:
def gen_logo():
    W, H = 300, 85
    cx, cy = 40, 52
    R_out = 28

    # We also render the text using a clean SVG-like path or bitmap:
    # Ò G H O W A
    # Letters at y from 16 to 52 (height 36px)
    # Positions x:
    # Ò: 82..104
    # G: 110..136
    # H: 142..168
    # O: 174..200
    # W: 206..240
    # A: 244..272

    def in_oghowa(x, y):
        # Top accent grave for Ò
        if 88 <= x <= 96 and 8 <= y <= 16:
            if abs((x - 88) - (16 - y)) <= 2:
                return True

        # O / Ò (x: 80..106, y: 16..52)
        if 80 <= x <= 106 and 16 <= y <= 52:
            ox, oy = (x - 93) / 12.0, (y - 34) / 17.0
            od = ox*ox + oy*oy
            if 0.55 <= od <= 1.05:
                return True

        # G (x: 110..136, y: 16..52)
        if 110 <= x <= 136 and 16 <= y <= 52:
            gx, gy = (x - 123) / 12.0, (y - 34) / 17.0
            gd = gx*gx + gy*gy
            if 0.55 <= gd <= 1.05 and not (gx > 0.2 and -0.4 < gy < 0.2):
                return True
            if 124 <= x <= 135 and 33 <= y <= 37: # crossbar
                return True
            if 131 <= x <= 136 and 33 <= y <= 50: # spur
                return True

        # H (x: 142..168, y: 16..52)
        if 142 <= x <= 168 and 16 <= y <= 52:
            if 142 <= x <= 149 or 161 <= x <= 168: # verticals
                return True
            if 148 <= x <= 162 and 31 <= y <= 37: # crossbar
                return True
            # serifs
            if 16 <= y <= 19 or 49 <= y <= 52:
                if (140 <= x <= 151) or (159 <= x <= 170):
                    return True

        # O (x: 174..200, y: 16..52)
        if 174 <= x <= 200 and 16 <= y <= 52:
            ox, oy = (x - 187) / 12.0, (y - 34) / 17.0
            od = ox*ox + oy*oy
            if 0.55 <= od <= 1.05:
                return True

        # W (x: 206..240, y: 16..52)
        if 206 <= x <= 240 and 16 <= y <= 52:
            # 4 diagonal strokes
            # stroke 1: (208, 16) to (215, 52)
            # stroke 2: (215, 52) to (223, 22)
            # stroke 3: (223, 22) to (231, 52)
            # stroke 4: (231, 52) to (238, 16)
            progress = (y - 16) / 36.0
            x1 = 208 + progress * 7
            x2 = 223 - progress * 8
            x3 = 223 + progress * 8
            x4 = 238 - progress * 7
            if abs(x - x1) <= 2.5 or abs(x - x2) <= 2.0 or abs(x - x3) <= 2.0 or abs(x - x4) <= 2.5:
                return True

        # A (x: 244..272, y: 16..52)
        if 244 <= x <= 272 and 16 <= y <= 52:
            progress = (y - 16) / 36.0
            xa1 = 258 - progress * 13
            xa2 = 258 + progress * 13
            if abs(x - xa1) <= 2.8 or abs(x - xa2) <= 2.8:
                return True
            if 248 <= x <= 268 and 38 <= y <= 42: # crossbar
                return True

        return False

    # Red Italic "Our own" (x: 180..275, y: 56..78)
    def in_our_own(x, y):
        # Approximate italic text region with red strokes
        # "Our own"
        if 180 <= x <= 275 and 58 <= y <= 76:
            # Shift x by italic slant:
            slant = (76 - y) * 0.35
            sx = x - slant
            # O: 184..196
            if 184 <= sx <= 196:
                d = ((sx - 190)/5.5)**2 + ((y - 67)/7.0)**2
                if 0.5 <= d <= 1.1:
                    return True
            # u: 199..209
            if 199 <= sx <= 209 and 63 <= y <= 74:
                if abs(sx - 200) <= 1.2 or abs(sx - 208) <= 1.2 or (y >= 72 and 200 <= sx <= 208):
                    return True
            # r: 212..220
            if 212 <= sx <= 220 and 63 <= y <= 74:
                if abs(sx - 213) <= 1.2 or (63 <= y <= 67 and 213 <= sx <= 219):
                    return True
            # o: 228..239
            if 228 <= sx <= 239 and 63 <= y <= 74:
                d = ((sx - 233.5)/5.0)**2 + ((y - 68.5)/5.5)**2
                if 0.45 <= d <= 1.1:
                    return True
            # w: 242..258
            if 242 <= sx <= 258 and 63 <= y <= 74:
                prog = (y - 63) / 11.0
                if abs(sx - (243 + prog*3)) <= 1.2 or abs(sx - (250 - prog*4)) <= 1.0 or abs(sx - (250 + prog*4)) <= 1.0 or abs(sx - (257 - prog*3)) <= 1.2:
                    return True
            # n: 261..272
            if 261 <= sx <= 272 and 63 <= y <= 74:
                if abs(sx - 262) <= 1.2 or abs(sx - 271) <= 1.2 or (63 <= y <= 66 and 262 <= sx <= 271):
                    return True

        return False

    def get_pixel(x, y):
        # Emblem on left
        if x <= 76:
            return draw_emblem_pixel(x, y, cx, cy, R_out, 28, 20)

        # Blue OGHOWA
        if in_oghowa(x, y):
            return 0x00, 0x1F, 0xD6, 255

        # Red "Our own"
        if in_our_own(x, y):
            return 0xE0, 0x1D, 0x1D, 255

        return 0, 0, 0, 0

    return create_png(W, H, get_pixel)

with open('public/logo.png', 'wb') as f:
    f.write(gen_logo())
print("public/logo.png written successfully")
