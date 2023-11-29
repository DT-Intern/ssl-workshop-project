from PIL import Image

image_path = "test.bmp"
image = Image.open(image_path)

width, height = image.size

with open("conv.txt", "w") as out_file:
    for y in range(height):
        for x in range(width):
            r, g, b = image.getpixel((x, y))
            out_file.write("1" if r+g+b == 0 else "0")
        out_file.write("\n")

image.close()
