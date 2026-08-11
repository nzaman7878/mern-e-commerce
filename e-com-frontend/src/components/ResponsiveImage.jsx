import React from 'react';

const ResponsiveImage = ({ src, alt, className, sizes = "100vw", onClick }) => {
    if (!src) return null;

    if (src.includes('cloudinary.com')) {
        const uploadIndex = src.indexOf('/upload/');
        if (uploadIndex !== -1) {
            const baseUrl = src.slice(0, uploadIndex + 8);
            const pathUrl = src.slice(uploadIndex + 8);

            // Strip existing transformations if any (e.g. f_webp,q_auto/)
            let cleanPathUrl = pathUrl;
            if (pathUrl.includes('/')) {
                const possibleTransforms = pathUrl.split('/')[0];
                if (possibleTransforms.includes(',') || possibleTransforms.includes('_')) {
                   // This is a naive check. If the first part looks like a transform (e.g. v12345 is version, but f_webp is transform)
                   // Actually, Cloudinary urls from upload don't have transforms, they have versions like v1234567/filename.
                   // If it starts with v and numbers, it's a version.
                }
            }

            const generateSrcSet = () => {
                const widths = [320, 480, 640, 800, 1024];
                return widths.map(w => `${baseUrl}w_${w},f_webp,q_auto/${cleanPathUrl} ${w}w`).join(', ');
            };

            const defaultSrc = `${baseUrl}f_webp,q_auto/${cleanPathUrl}`;

            return (
                <img
                    src={defaultSrc}
                    srcSet={generateSrcSet()}
                    sizes={sizes}
                    alt={alt}
                    className={className}
                    loading="lazy"
                    onClick={onClick}
                />
            );
        }
    }

    return <img src={src} alt={alt} className={className} loading="lazy" onClick={onClick} />;
};

export default ResponsiveImage;
