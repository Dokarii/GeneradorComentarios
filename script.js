document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Inputs
    const inputUsername = document.getElementById('username');
    const inputColor = document.getElementById('userColor');
    const inputColorHex = document.getElementById('colorHex');
    const inputComment = document.getElementById('comment');
    const checkBadge1 = document.getElementById('showBadge1');
    const checkBadge2 = document.getElementById('showBadge2');

    // DOM Elements - Preview
    const displayUsername = document.getElementById('display-username');
    const displayColon = document.getElementById('display-colon');
    const displayMessage = document.getElementById('display-message');
    const badge1 = document.getElementById('badge1-img');
    const badge2 = document.getElementById('badge2-img');
    const badgesContainer = document.getElementById('badges-container');

    // Core Elements
    const downloadBtn = document.getElementById('downloadBtn');
    const captureArea = document.getElementById('capture-area');

    // Live update function
    function updatePreview() {
        // Update Text
        displayUsername.textContent = inputUsername.value || 'Usuario';
        displayMessage.textContent = inputComment.value || ' ';

        // Update Colors
        const color = inputColor.value;
        displayUsername.style.color = color;
        // In the reference image the colon matches the user's color
        displayColon.style.color = color;

        // Enhance UX by showing the hex code in uppercase
        inputColorHex.textContent = color.toUpperCase();

        // Update Badges visibility
        badge1.style.display = checkBadge1.checked ? 'inline-block' : 'none';
        badge2.style.display = checkBadge2.checked ? 'inline-block' : 'none';

        // If no badges are checked, hide the badge container to remove its right margin
        if (!checkBadge1.checked && !checkBadge2.checked) {
            badgesContainer.style.display = 'none';
        } else {
            badgesContainer.style.display = 'inline-flex';
        }
    }

    // Attach Event Listeners
    inputUsername.addEventListener('input', updatePreview);
    inputColor.addEventListener('input', updatePreview);
    inputComment.addEventListener('input', updatePreview);
    checkBadge1.addEventListener('change', updatePreview);
    checkBadge2.addEventListener('change', updatePreview);

    // Initial render
    updatePreview();

    // HTML to Image generation
    downloadBtn.addEventListener('click', () => {
        // Set loading state visually
        const originalContent = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<ion-icon name="sync-outline" class="spin"></ion-icon> Generando...';
        downloadBtn.classList.add('loading');

        // Allow UI to update before heavy synchronous html2canvas work
        setTimeout(() => {
            html2canvas(captureArea, {
                backgroundColor: null, // Fondo transparente para mantener bordes redondeados
                scale: 4, // Higher scale = better resolution (Retina quality)
                logging: false,
                useCORS: true
            }).then(canvas => {
                // Convert canvas to image URL
                const image = canvas.toDataURL('image/png');

                // Create a dynamic link to trigger download
                const link = document.createElement('a');
                const sanitzedName = (inputUsername.value || 'comentario').replace(/[^a-zA-Z0-9]/g, '_');
                link.download = `twitch_${sanitzedName}.png`;
                link.href = image;

                // Fire download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Restore button state
                downloadBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Descargado';
                setTimeout(() => {
                    downloadBtn.innerHTML = originalContent;
                    downloadBtn.classList.remove('loading');
                }, 2000);
            }).catch(err => {
                console.error('Error generating image:', err);
                alert('Ocurrió un error al generar la captura.');
                downloadBtn.innerHTML = originalContent;
                downloadBtn.classList.remove('loading');
            });
        }, 100);
    });
});
