document.addEventListener('DOMContentLoaded', () => {
    const seals = [
        {
            name: 'Seal 1',
            description: 'This is Seal 1. It loves to swim and play.',
            imageUrl: 'seal1.jpg'
        },
        {
            name: 'Seal 2',
            description: 'Seal 2 enjoys lounging on the beach.',
            imageUrl: 'seal2.jpg'
        },
        {
            name: 'Seal 3',
            description: 'Seal 3 is known for its playful nature.',
            imageUrl: 'seal3.jpg'
        }
    ];

    const sealContainer = document.getElementById('sealContainer');
    const addCard = document.getElementById('addCard');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');
    const sealForm = document.getElementById('sealForm');

    seals.forEach(seal => {
        const sealCard = createSealCard(seal);
        sealContainer.appendChild(sealCard);
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
        const title = document.getElementById('sealTitle').value;
        const description = document.getElementById('sealDescription').value;
        const fileInput = document.getElementById('sealImage');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newSeal = {
                    name: title,
                    description: description,
                    imageUrl: e.target.result
                };
                const newSealCard = createSealCard(newSeal);
                sealContainer.appendChild(newSealCard);
                modal.style.display = 'none';
                sealForm.reset();
            };
            reader.readAsDataURL(file);
        }
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
