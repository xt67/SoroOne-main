from PIL import Image, ImageDraw, ImageFont
import os

# Create splash screen (1284x2778 - iPhone 12 Pro Max resolution)
width, height = 1284, 2778
splash = Image.new('RGBA', (width, height), color='white')
draw = ImageDraw.Draw(splash)

# Create white to light gray gradient background
for y in range(height):
    # White to light gray gradient
    gray_value = int(255 - (7 * y/height))  # From 255 (white) to 248 (light gray)
    color = (gray_value, gray_value, gray_value, 255)
    draw.line([(0, y), (width, y)], fill=color)

# Draw chart container in center
chart_width = 600
chart_height = 400
chart_x = (width - chart_width) // 2
chart_y = (height - chart_height) // 2 - 200

# Chart background
chart_bg = Image.new('RGBA', (width, height), (0, 0, 0, 0))
chart_bg_draw = ImageDraw.Draw(chart_bg)
chart_bg_draw.rounded_rectangle([chart_x, chart_y, chart_x + chart_width, chart_y + chart_height], 
                               radius=20, fill=(255, 255, 255, 255), outline=(229, 231, 235, 255), width=4)
splash = Image.alpha_composite(splash, chart_bg)
draw = ImageDraw.Draw(splash)

# Draw chart bars
bar_data = [
    (chart_x + 80, chart_y + 150, 180),   # x, y, height
    (chart_x + 160, chart_y + 100, 230),
    (chart_x + 240, chart_y + 200, 130),
    (chart_x + 320, chart_y + 120, 210),
    (chart_x + 400, chart_y + 80, 250)
]

bar_color = (31, 41, 55)  # Dark gray bars

# Draw bars directly on splash
draw = ImageDraw.Draw(splash)
for x, y, bar_height in bar_data:
    draw.rounded_rectangle([x, y, x + 60, y + bar_height], radius=6, fill=bar_color)

# Draw trend line
draw = ImageDraw.Draw(splash)
trend_color = (59, 130, 246)  # Blue
line_points = [(chart_x + 110, chart_y + 150), (chart_x + 190, chart_y + 100), 
               (chart_x + 270, chart_y + 200), (chart_x + 350, chart_y + 120), 
               (chart_x + 430, chart_y + 80)]

for i in range(len(line_points) - 1):
    draw.line([line_points[i], line_points[i+1]], fill=trend_color, width=4)

# Draw dots
for x, y in line_points:
    draw.ellipse([x-6, y-6, x+6, y+6], fill=trend_color)

# Add SoroOne text below chart
try:
    title_font = ImageFont.truetype("arial.ttf", 100)
except:
    title_font = ImageFont.load_default()

title_text = "SoroOne"
title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
title_width = title_bbox[2] - title_bbox[0]
title_x = (width - title_width) // 2
title_y = chart_y + chart_height + 80

# Add text shadow
draw.text((title_x + 2, title_y + 2), title_text, font=title_font, fill=(0, 0, 0, 40))
draw.text((title_x, title_y), title_text, font=title_font, fill=(31, 41, 55, 255))

# Save splash screen
splash_path = os.path.join(os.path.dirname(__file__), 'assets', 'splash.png')
splash.save(splash_path, 'PNG')

print(f"Splash screen saved to: {splash_path}")
