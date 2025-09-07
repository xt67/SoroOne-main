from PIL import Image, ImageDraw, ImageFont
import os

# Create a new image with a blue gradient background
size = 1024
image = Image.new('RGBA', (size, size), color='white')
draw = ImageDraw.Draw(image)

# Create gradient background
for y in range(size):
    # Blue gradient from #3B82F6 to #1E40AF
    r = int(59 + (30-59) * y/size)
    g = int(130 + (64-130) * y/size) 
    b = int(246 + (175-246) * y/size)
    color = (r, g, b, 255)
    draw.line([(0, y), (size, y)], fill=color)

# Draw rounded rectangle overlay
overlay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
overlay_draw = ImageDraw.Draw(overlay)
overlay_draw.rounded_rectangle([80, 80, size-80, size-80], radius=150, fill=(255, 255, 255, 25))
image = Image.alpha_composite(image, overlay)
draw = ImageDraw.Draw(image)

# Draw chart bars
bar_colors = [(96, 165, 250), (52, 211, 153), (251, 191, 36), (248, 113, 113)]
bar_positions = [(200, 300), (350, 450), (500, 250), (650, 380)]
bar_width = 120

for i, (x, height) in enumerate(bar_positions):
    y = 700 - height
    # Draw rounded rectangle for bars
    bar_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    bar_draw = ImageDraw.Draw(bar_img)
    bar_draw.rounded_rectangle([x, y, x + bar_width, 700], radius=15, fill=bar_colors[i])
    image = Image.alpha_composite(image, bar_img)

# Draw the "S" letter
draw = ImageDraw.Draw(image)
try:
    # Try to use a system font
    font = ImageFont.truetype("arial.ttf", 280)
except:
    # Fallback to default font
    font = ImageFont.load_default()

# Get text dimensions
bbox = draw.textbbox((0, 0), "S", font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

# Center the text
x = (size - text_width) // 2
y = (320 - text_height) // 2

# Draw shadow first
draw.text((x + 5, y + 5), "S", font=font, fill=(0, 0, 0, 100))
# Draw main text
draw.text((x, y), "S", font=font, fill=(255, 255, 255, 255))

# Save the icon
output_path = os.path.join(os.path.dirname(__file__), 'assets', 'icon.png')
image.save(output_path, 'PNG')

# Create adaptive icon (simpler version)
adaptive_image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
adaptive_draw = ImageDraw.Draw(adaptive_image)

# Draw circle background
adaptive_draw.ellipse([112, 112, size-112, size-112], fill=(59, 130, 246, 255))

# Draw "S" letter
try:
    adaptive_font = ImageFont.truetype("arial.ttf", 250)
except:
    adaptive_font = ImageFont.load_default()

# Center the text
bbox = adaptive_draw.textbbox((0, 0), "S", font=adaptive_font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (size - text_width) // 2
y = (size - text_height) // 2

adaptive_draw.text((x, y), "S", font=adaptive_font, fill=(255, 255, 255, 255))

# Save adaptive icon
adaptive_path = os.path.join(os.path.dirname(__file__), 'assets', 'adaptive-icon.png')
adaptive_image.save(adaptive_path, 'PNG')

print("Icons generated successfully!")
print(f"Main icon saved to: {output_path}")
print(f"Adaptive icon saved to: {adaptive_path}")
