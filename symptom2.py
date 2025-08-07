import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk
from PIL import Image, ImageTk
import os
import cv2
from skimage.metrics import structural_similarity as ssim
import numpy as np

class CancerDetectionApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CanScan Lite - Cancer Detection")
        self.root.geometry("800x600")
        self.root.configure(bg='lightblue')

        self.dataset_path = None
        self.image_path = None
        self.image_match = False
        self.symptom_vars = []

        self.current_step = 0
        self.steps = [self.step_select_dataset, self.step_upload_image, self.step_analyze_image, self.step_select_symptoms, self.step_final_verdict]

        self.frame = tk.Frame(self.root, bg='lightblue')
        self.frame.pack(expand=True, fill=tk.BOTH)

        self.navigation_frame = tk.Frame(self.root, bg='lightblue')
        self.navigation_frame.pack(fill=tk.X, side=tk.BOTTOM, pady=10)
        self.back_button = tk.Button(self.navigation_frame, text="⬅ Back", command=self.prev_step, state=tk.DISABLED)
        self.back_button.pack(side=tk.LEFT, padx=20)
        self.next_button = tk.Button(self.navigation_frame, text="Next ➡", command=self.next_step)
        self.next_button.pack(side=tk.RIGHT, padx=20)

        self.steps[self.current_step]()

    def clear_frame(self):
        for widget in self.frame.winfo_children():
            widget.destroy()

    def prev_step(self):
        if self.current_step > 0:
            self.current_step -= 1
            self.update_step()

    def next_step(self):
        if self.current_step < len(self.steps) - 1:
            self.current_step += 1
            self.update_step()

    def update_step(self):
        self.clear_frame()
        self.steps[self.current_step]()
        self.back_button["state"] = tk.NORMAL if self.current_step > 0 else tk.DISABLED
        self.next_button["text"] = "Next ➡" if self.current_step < len(self.steps) - 1 else "Finish"

    def step_select_dataset(self):
        tk.Label(self.frame, text="Step 1: Select Dataset Folder", bg='lightblue', font=("Helvetica", 18)).pack(pady=20)
        tk.Button(self.frame, text="Choose Folder", command=self.select_dataset).pack(pady=10)

    def select_dataset(self):
        folder = filedialog.askdirectory()
        if folder:
            self.dataset_path = folder
            messagebox.showinfo("Folder Selected", f"Dataset path set to:\n{folder}")

    def step_upload_image(self):
        tk.Label(self.frame, text="Step 2: Upload Medical Image", bg='lightblue', font=("Helvetica", 18)).pack(pady=20)
        tk.Button(self.frame, text="Upload Image", command=self.upload_image).pack(pady=10)
        self.img_label = tk.Label(self.frame, bg='lightblue')
        self.img_label.pack(pady=10)

    def upload_image(self):
        file = filedialog.askopenfilename(filetypes=[("Image Files", "*.png;*.jpg;*.jpeg")])
        if file:
            self.image_path = file
            img = Image.open(file)
            img = img.resize((300, 300))
            img = ImageTk.PhotoImage(img)
            self.img_label.configure(image=img)
            self.img_label.image = img

    def step_analyze_image(self):
        tk.Label(self.frame, text="Step 3: Analyze Image", bg='lightblue', font=("Helvetica", 18)).pack(pady=20)
        if not self.image_path or not self.dataset_path:
            tk.Label(self.frame, text="Please select dataset and upload an image before proceeding.", bg='lightblue', fg='red').pack()
            return

        result = self.check_image_match(self.image_path, self.dataset_path)
        color = 'green' if result else 'red'
        verdict = "✅ Image match found in dataset. Possible cancer risk." if result else "✅ No image match found. Low risk based on image."
        self.image_match = result
        label = tk.Label(self.frame, text=verdict, font=("Helvetica", 14), fg=color, bg='lightblue')
        label.pack(pady=30)

    def check_image_match(self, uploaded_image, dataset_folder, threshold=0.85):
        uploaded_img = cv2.imread(uploaded_image, cv2.IMREAD_GRAYSCALE)
        uploaded_img = cv2.resize(uploaded_img, (256, 256))

        for file in os.listdir(dataset_folder):
            file_path = os.path.join(dataset_folder, file)
            if os.path.isfile(file_path):
                dataset_img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
                if dataset_img is None:
                    continue
                dataset_img = cv2.resize(dataset_img, (256, 256))
                score, _ = ssim(uploaded_img, dataset_img, full=True)
                if score >= threshold:
                    return True
        return False

    def step_select_symptoms(self):
        tk.Label(self.frame, text="Step 4: Select Observed Symptoms", bg='lightblue', font=("Helvetica", 18)).pack(pady=20)
        symptoms = [
            "Sudden weight loss",
            "Persistent fatigue",
            "Unusual lumps",
            "Chronic cough",
            "Skin changes",
            "Frequent infections",
            "Unexplained bleeding",
            "Persistent pain",
            "Difficulty swallowing",
            "Changes in bladder habits"
        ]
        self.symptom_vars = []
        for sym in symptoms:
            var = tk.IntVar()
            chk = tk.Checkbutton(self.frame, text=sym, variable=var, bg='lightblue', font=("Helvetica", 12))
            chk.pack(anchor='w', padx=40)
            self.symptom_vars.append(var)

    def step_final_verdict(self):
        tk.Label(self.frame, text="Step 5: Final Verdict", bg='lightblue', font=("Helvetica", 18)).pack(pady=20)

        symptom_score = sum(var.get() for var in self.symptom_vars)

        if self.image_match and symptom_score >= 3:
            msg = "🔴 High Risk: Consult a doctor immediately."
            color = 'red'
        elif self.image_match or symptom_score >= 3:
            msg = "🟠 Moderate Risk: Further tests recommended."
            color = 'orange'
        else:
            msg = "🟢 Low Risk: You're likely safe."
            color = 'green'

        verdict_label = tk.Label(self.frame, text=msg, font=("Helvetica", 20, "bold"), fg=color, bg='lightblue')
        verdict_label.pack(pady=30)

if __name__ == '__main__':
    root = tk.Tk()
    app = CancerDetectionApp(root)
    root.mainloop()

