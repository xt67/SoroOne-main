from PIL import Image, ImageDraw, ImageFont
import os

# Create a new image with a white gradient background
size = 1024
image = Image.new('RGBA', (size, size), color='white')
draw = ImageDraw.Draw(image)

# Create white to light gray gradient background
for y in range(size):
    # White to light gray gradient
    gray_value = int(255 - (7 * y/size))  # From 255 (white) to 248 (light gray)
    color = (gray_value, gray_value, gray_value, 255)
    draw.line([(0, y), (size, y)], fill=color)

# Draw chart container background
chart_bg = Image.new('RGBA', (size, size), (0, 0, 0, 0))
chart_draw = ImageDraw.Draw(chart_bg)
chart_draw.rounded_rectangle([150, 200, 874, 700], radius=20, fill=(255, 255, 255, 255), outline=(229, 231, 235, 255), width=4)
image = Image.alpha_composite(image, chart_bg)
draw = ImageDraw.Draw(image)

# Draw chart bars
bar_data = [
    (220, 350, 280),  # x, y, height
    (330, 280, 350),
    (440, 400, 230),
    (550, 320, 310),
    (660, 250, 380)
]

bar_color = (31, 41, 55)  # Dark gray bars

for x, y, height in bar_data:
    bar_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    bar_draw = ImageDraw.Draw(bar_img)
    bar_draw.rounded_rectangle([x, y, x + 80, y + height], radius=8, fill=bar_color)
    image = Image.alpha_composite(image, bar_img)

# Draw trend line and dots
draw = ImageDraw.Draw(image)
trend_color = (59, 130, 246)  # Blue

# Draw line segments
line_points = [(260, 350), (370, 280), (480, 400), (590, 320), (700, 250)]
for i in range(len(line_points) - 1):
    draw.line([line_points[i], line_points[i+1]], fill=trend_color, width=6)

# Draw dots
for x, y in line_points:
    draw.ellipse([x-8, y-8, x+8, y+8], fill=trend_color)

# Draw axes
axis_color = (156, 163, 175)  # Gray
draw.line([(200, 650), (820, 650)], fill=axis_color, width=2)  # X-axis
draw.line([(200, 230), (200, 650)], fill=axis_color, width=2)  # Y-axis

# Draw the "SoroOne" text
try:
    # Try to use a system font
    font = ImageFont.truetype("arial.ttf", 120)
except:
    # Fallback to default font
    font = ImageFont.load_default()

# Get text dimensions
text = "SoroOne"
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

# Center the text
x = (size - text_width) // 2
y = 800 - text_height // 2

# Draw text shadow first
draw.text((x + 2, y + 2), text, font=font, fill=(0, 0, 0, 40))
# Draw main text
draw.text((x, y), text, font=font, fill=(31, 41, 55, 255))

# Save the icon
output_path = os.path.join(os.path.dirname(__file__), 'assets', 'icon.png')
image.save(output_path, 'PNG')

# Create adaptive icon (simpler version)
adaptive_image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
adaptive_draw = ImageDraw.Draw(adaptive_image)

# Draw white circle background
adaptive_draw.ellipse([112, 112, size-112, size-112], fill=(255, 255, 255, 255))

# Draw simplified chart in center
mini_bars = [(400, 400, 150), (450, 350, 200), (500, 450, 100), (550, 380, 170)]
for x, y, height in mini_bars:
    adaptive_draw.rectangle([x, y, x + 30, y + height], fill=(31, 41, 55))

# Draw "SoroOne" text
try:
    adaptive_font = ImageFont.truetype("arial.ttf", 80)
except:
    adaptive_font = ImageFont.load_default()

# Center the "SoroOne" text at bottom
text = "SoroOne"
bbox = adaptive_draw.textbbox((0, 0), text, font=adaptive_font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (size - text_width) // 2
y = 650

adaptive_draw.text((x, y), text, font=adaptive_font, fill=(31, 41, 55, 255))

# Save adaptive icon
adaptive_path = os.path.join(os.path.dirname(__file__), 'assets', 'adaptive-icon.png')
adaptive_image.save(adaptive_path, 'PNG')

print("Icons generated successfully!")
print(f"Main icon saved to: {output_path}")
print(f"Adaptive icon saved to: {adaptive_path}")
