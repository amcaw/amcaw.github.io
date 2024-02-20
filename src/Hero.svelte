<div class="text-center-wrapper">
    <h4 class="subtitle">sub</h4>
    <h1 class="title">Title</h1>

    <div class="authors">
        <h3 class="author-names">Par somebody</h3>
    </div>

   
</div>

<style>

.text-center-wrapper {
    text-align: center;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
    top: 0;
    z-index: 0;
    background-image: url('../pics/hero.jpg'); /* Add your image path here */
    background-size: cover; /* Cover the entire container */
    background-position: center; /* Center the background image */
    background-repeat: no-repeat; /* Do not repeat the image */
}

.subtitle {
    font-size: 0.875rem;
}

.title {
    font-size: 3.125rem; 
    font-weight: 800;
    letter-spacing: -0.05em; 
    max-width: 64rem; 
    font-family: Orbitron;
}

.authors {
    text-align: center;
}

.author-names {
    font-size: 1.125rem;
    padding: 8px;
    border-radius: 12px;
    letter-spacing: -0.015em; 
    max-width: fit-content;
}




.title, .subtitle, .author-names {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}





@media (max-width: 768px) {
    .title {
        font-size: 2.5rem; 
        max-width: 90%; 
        padding: 0 20px; 
    }

    .author-names {
        font-size: 1rem; 
    }

}


@media (max-width: 480px) {
    .title {
        font-size: 2rem; 
    }

    .author-names {
        font-size: 0.875rem; 
    }
}





</style>