// Utilities for image optimization

export const optimizeImage = (url) => {
    if (!url) return '';
    // Check if it's a cloudinary URL and doesn't already have f_webp
    if (url.includes('cloudinary.com') && !url.includes('f_webp')) {
        // Find the position of '/upload/' and insert 'f_webp,q_auto/' after it
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex !== -1) {
            return url.slice(0, uploadIndex + 8) + 'f_webp,q_auto/' + url.slice(uploadIndex + 8);
        }
    }
    return url;
};
