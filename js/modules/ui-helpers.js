const bookCoverInput = document.querySelector('.add-book_cover');
const imgPreview = document.querySelector('.cover-preview');
const label = document.querySelector('.add-book_label-cover');

bookCoverInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const coverText = label.querySelector('.cover-text');
    console.log('Файл выбран:', file);
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imgPreview.src = reader.result;
            imgPreview.classList.remove('hidden');
            coverText.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        imgPreview.src = "";
        imgPreview.classList.add('hidden');
        coverText.classList.remove('hidden');
    }
});

export const getBookDesign = () => {
    const chance = Math.random() * 100;
    let hue;
    if (chance < 25) {
        hue = Math.floor(Math.random() * 40 + 310);
    } else if (chance < 50) {
        hue = Math.floor(Math.random() * 50 + 240);
    } else if (chance < 75) {
        hue = Math.floor(Math.random() * 40 + 180);
    } else {
        hue = Math.floor(Math.random() * 50 + 80);
    }
    return hue;
};

export const compressImage = (base64Str, maxWidth = 400, quality = 0.7) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = maxWidth / img.width;

            if (scale >= 1) {
                resolve(base64Str);
                return;
            }

            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
    });
};