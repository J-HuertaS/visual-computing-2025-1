# 🧪 Workshop - Digital Eyes: Image Processing

📅 **Date**  
`2025-05-18` – Date of completion or submission

---

## 🎯 **Workshop Objective**  
Explore fundamental image processing techniques using OpenCV in Python, including grayscale conversion, application of convolutional filters (blur and sharpening), edge detection, and interactive parameter adjustment via sliders in Google Colab. The workshop aims to understand digital image manipulation and visualize the effects of various algorithms in real-time.

---

## 🧠 **Concepts Learned**  
Key concepts applied include:  
- Loading and converting images to grayscale.  
- Applying convolutional filters (Blur for smoothing, Sharpening for detail enhancement).  
- Edge detection using the Canny algorithm.  
- Using interactive sliders with `ipywidgets` for dynamic parameter adjustment.  
- Generating visualizations and animated GIFs to document results.

---

## 🔧 **Tools and Environments**  
The following tools and environments were used:  
- 💻 **Python (Google Colab)**  
  Tools: `opencv-python`, `numpy`, `matplotlib`, `ipywidgets`, `imageio`

---

## 📁 **Project Structure**  
```
2025-05-18_digital_eyes_workshop/
├── python/
│   ├── digital_eyes_workshop.ipynb  # Notebook with workshop code
│   ├── sample_image.jpg            # Input image
│   ├── results/
│       ├── grayscale_filters.gif   # GIF of convolutional filters
│       ├── edge_detection.gif      # GIF of edge detection
│       ├── filter_slider.gif       # GIF of interactive sliders
├── README.md                       # This file
```

---

## 🧪 **Implementation**  
The workshop is divided into the following stages, implemented in a Google Colab notebook:

🔹 **Stages Completed**  
1. **Image Loading and Grayscale Conversion**:  
   An image (`sample_image.jpg`) is loaded and converted to grayscale to simplify processing.  
2. **Convolutional Filters**:  
   Two filters are applied:  
   - **Blur**: Uses a 5x5 averaging kernel to smooth the image.  
   - **Sharpening**: Uses a dynamic 5x5 kernel to enhance details, making the image sharper.  
   Both filters utilize OpenCV’s `cv2.filter2D` function.  
3. **Edge Detection**:  
   The Canny algorithm is implemented to detect edges, with adjustable thresholds (`threshold1`, `threshold2`) to control sensitivity.  
4. **Interactive Sliders (Bonus)**:  
   Sliders with `ipywidgets` allow dynamic adjustment of kernel size (3 to 15) and filter type (Blur or Sharpening). The Sharpening filter uses the same dynamic kernel as the filters section for consistency.  
5. **Result Storage**:  
   Animated GIFs (`grayscale_filters.gif`, `edge_detection.gif`, `filter_slider.gif`) are generated to document visual results.

🔹 **Relevant Code**  
Key code snippets from the workshop:

**Python (Convolutional Filters)**  
```python
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Load image in grayscale
img = cv2.imread('sample_image.jpg')
img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Function to generate dynamic sharpening kernel
def create_sharpening_kernel(ksize):
    kernel = np.zeros((ksize, ksize), np.float32)
    center = ksize // 2
    alpha = 2.0
    kernel[center, center] = 1 + alpha * ksize
    kernel[center-1, center] = -alpha * ksize / 4
    kernel[center+1, center] = -alpha * ksize / 4
    kernel[center, center-1] = -alpha * ksize / 4
    kernel[center, center+1] = -alpha * ksize / 4
    return kernel

# Define kernels
kernel_blur = np.ones((5, 5), np.float32) / 25
kernel_sharpen = create_sharpening_kernel(5)

# Apply filters
img_blur = cv2.filter2D(img_gray, -1, kernel_blur)
img_sharpen = cv2.filter2D(img_gray, -1, kernel_sharpen)

# Visualize
plt.figure(figsize=(15, 5))
plt.subplot(1, 3, 1)
plt.title('Original (Grayscale)')
plt.imshow(img_gray, cmap='gray')
plt.axis('off')
plt.subplot(1, 3, 2)
plt.title('Blur')
plt.imshow(img_blur, cmap='gray')
plt.axis('off')
plt.subplot(1, 3, 3)
plt.title('Sharpening')
plt.imshow(img_sharpen, cmap='gray')
plt.axis('off')
plt.show()
```

**Python (Interactive Sliders)**  
```python
from ipywidgets import interact, IntSlider

# Function to apply filter with sliders
def apply_filter(ksize, filter_type):
    ksize = max(3, ksize | 1)
    if filter_type == 0:  # Blur
        kernel = np.ones((ksize, ksize), np.float32) / (ksize * ksize)
        filter_name = "Blur"
    else:  # Sharpening
        kernel = create_sharpening_kernel(ksize)
        filter_name = "Sharpening"
    img_filtered = cv2.filter2D(img_gray, -1, kernel)
    plt.figure(figsize=(8, 8))
    plt.title(f'{filter_name} (Kernel {ksize}x{ksize})')
    plt.imshow(img_filtered, cmap='gray')
    plt.axis('off')
    plt.show()

# Create sliders
interact(apply_filter,
         ksize=IntSlider(min=3, max=15, step=2, value=3, description='Kernel Size'),
         filter_type=IntSlider(min=0, max=1, step=1, value=0, description='Filter Type (0=Blur, 1=Sharpening)'))
```

---

## 📊 **Visual Results**  
📌 The workshop includes animated GIFs to document results:

**Convolutional Filters**  


![image](https://github.com/user-attachments/assets/95de2d66-c6d1-47da-b46c-03c54ff2f036)

**Edge Detection**  


![image](https://github.com/user-attachments/assets/48414cb9-a6b7-4048-af43-ef0ea91fc2a9)

**Interactive Sliders**  

![Filtros](https://github.com/user-attachments/assets/89115e19-6744-4e34-97b7-36c6a8126f0a)

---

## 🧩 **Prompts Used**  
Prompts that guided the development:  
```text
- "Create a Python script to load an image and convert it to grayscale using OpenCV."
```
```text 
- "Write a function to apply convolutional filters (Blur and Sharpening) with OpenCV."
```
```text
- "Show how to implement interactive sliders in Google Colab with ipywidgets for filter parameter adjustment."
```

---

## 💬 **Final Reflection**  
This workshop provided a valuable opportunity to dive into image processing with OpenCV. Loading and converting images to grayscale laid the foundation for understanding visual data manipulation. Convolutional filters (Blur and Sharpening) demonstrated how kernels alter image appearance, with Sharpening standing out for its detail enhancement. Edge detection with Canny was crucial for identifying structural features. The most engaging part was the bonus, where interactive sliders enabled real-time experimentation, revealing how kernel size impacts filter effects.

The main challenge was tuning the Sharpening filter to achieve a clear, consistent sharpening effect, especially with larger kernels. Unifying the dynamic kernel across the filters and sliders sections resolved this, ensuring predictable behavior. For future projects, these techniques could be applied to image enhancement, object recognition, or texture analysis. The workshop could be enhanced by exploring additional filters (e.g., Sobel or Gaussian Blur) or incorporating real-time video processing.

---

## ✅ **Submission Checklist**  
- [x] Folder `2025-05-18_digital_eyes_workshop`  
- [x] Clean and functional code in `digital_eyes_workshop.ipynb`  
- [x] GIFs included with descriptive names (`grayscale_filters.gif`, `edge_detection.gif`, `filter_slider.gif`)  
- [x] Visualizations exported to `python/results/`  
- [x] Complete and clear README  
- [x] Descriptive commits in English





