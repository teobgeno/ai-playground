from api import main
import noise
import numpy as np
import matplotlib.pyplot as plt


main.init()

# def generate_terrain(width, height, scale):
#     terrain = np.zeros((width, height))

#     for i in range(width):
#         for j in range(height):
#             terrain[i][j] = noise.pnoise2(
#                 i/scale, j/scale, octaves=6, persistence=0.5, lacunarity=2.0, repeatx=1024, repeaty=1024, base=42)

#     return terrain


# def visualize_terrain(terrain):
#     plt.imshow(terrain, cmap='terrain', interpolation='bilinear')
#     plt.colorbar()
#     plt.show()


# def main():
#     width, height = 100, 100
#     scale = 20.0

#     terrain = generate_terrain(width, height, scale)
#     visualize_terrain(terrain)


# if __name__ == "__main__":
#     main()
