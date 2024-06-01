document.addEventListener('DOMContentLoaded', () => {
    const sealContainer = document.getElementById('sealContainer');
    const addCard = document.getElementById('addCard');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');
    const sealForm = document.getElementById('sealForm');

    // Fetch seals from the server
    fetch('/api/seals')
        .then(response => response.json())
        .then(seals => {
            seals.forEach(seal => {
                const sealCard = createSealCard(seal);
                sealContainer.appendChild(sealCard);
            });
        });

    addCard.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    sealForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(sealForm);

        fetch('/api/seals', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(newSeal => {
                if (newSeal.message) {
                    alert(newSeal.message);
                    return;
                }
                const newSealCard = createSealCard(newSeal);
                sealContainer.appendChild(newSealCard);
                modal.style.display = 'none';
                sealForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    function createSealCard(seal) {
        const sealCard = document.createElement('div');
        sealCard.classList.add('seal-card');

        const sealImage = document.createElement('img');
        sealImage.src = seal.imageUrl;
        sealImage.alt = seal.name;

        const sealName = document.createElement('h2');
        sealName.textContent = seal.name;

        const sealDescription = document.createElement('p');
        sealDescription.textContent = seal.description;

        sealCard.appendChild(sealImage);
        sealCard.appendChild(sealName);
        sealCard.appendChild(sealDescription);

        return sealCard;
    }
});
