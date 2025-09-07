from PIL import Image, ImageDraw, ImageFont
import os

# Create splash screen (1284x2778 - iPhone 12 Pro Max resolution)
width, height = 1284, 2778
splash = Image.new('RGBA', (width, height), color='white')
draw = ImageDraw.Draw(splash)

# Create gradient background
for y in range(height):
    # Blue gradient from #3B82F6 to #1E40AF
    ratio = y / height
    r = int(59 + (30-59) * ratio)
    g = int(130 + (64-130) * ratio) 
    b = int(246 + (175-246) * ratio)
    color = (r, g, b, 255)
    draw.line([(0, y), (width, y)], fill=color)

# Draw the "S" letter in the center
try:
    font = ImageFont.truetype("arial.ttf", 400)
except:
    font = ImageFont.load_default()

# Center the text
bbox = draw.textbbox((0, 0), "S", font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (width - text_width) // 2
y = (height - text_height) // 2

# Draw shadow
draw.text((x + 8, y + 8), "S", font=font, fill=(0, 0, 0, 80))
# Draw main text
draw.text((x, y), "S", font=font, fill=(255, 255, 255, 255))

# Add SoroOne text below
try:
    title_font = ImageFont.truetype("arial.ttf", 80)
except:
    title_font = ImageFont.load_default()

title_text = "SoroOne"
title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
title_width = title_bbox[2] - title_bbox[0]
title_x = (width - title_width) // 2
title_y = y + text_height + 100

draw.text((title_x, title_y), title_text, font=title_font, fill=(255, 255, 255, 200))

# Save splash screen
splash_path = os.path.join(os.path.dirname(__file__), 'assets', 'splash.png')
splash.save(splash_path, 'PNG')

print(f"Splash screen saved to: {splash_path}")
