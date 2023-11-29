from PIL import Image

with open("alphabet.txt", "w") as out_file:
    for i in range(26):
        image_path = "../resources/pixel-art/" + chr(65 + i) + ".png"
        image = Image.open(image_path)
        width, height = image.size
        out_file.write("\"")
        for y in range(height):
            for x in range(width):
                r, g, b = image.getpixel((x, y))
                out_file.write("1" if r+g+b == 0 else "0")
            if y != height - 1:
                out_file.write("\\n")
        out_file.write("\",\n")

with open("tree.txt", "w") as out_file:
    image_path = "../resources/pixel-art/tree.png"
    image = Image.open(image_path)
    width, height = image.size
    out_file.write("\"")
    for y in range(height):
        for x in range(width):
            r, g, b = image.getpixel((x, y))
            out_file.write("1" if r+g+b == 0 else "0")
        if y != height - 1:
            out_file.write("\\n")

image.close()
