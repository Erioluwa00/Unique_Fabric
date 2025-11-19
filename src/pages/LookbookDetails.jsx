import React from "react";
import "./LookbookDetails.css"
const LookbookDetails = () => {
    return(
        <>
            <div class="fabric-detail-container">

        {/* <!-- 1. Breadcrumb Navigation --> */}
        <nav class="fabric-detail-breadcrumb" aria-label="Breadcrumb">
            <ol class="fabric-detail-breadcrumb-list">
                <li>
                    <a href="#">Home</a>
                </li>
                <li>
                    <a href="#">Lookbook</a>
                </li>
                <li class="fabric-detail-current-page" aria-current="page">
                    <span>Design Details</span>
                </li>
            </ol>
        </nav>

        {/* <!-- 2. Main Product Details Section --> */}
        <main class="fabric-detail-main-content">
            
            {/* <!-- Left Column: Image Gallery --> */}
            <div class="fabric-detail-image-gallery">
                <img src="https://c7684bdb45.mjedge.net/wp-content/uploads/zikoko/2025/05/1de44119667e2fb5243f54fb53e347c3.jpg" 
                     alt="Traditional bridal attire in red ankara fabric"/>
                {/* <!-- You could add thumbnail images here --> */}
            </div>

            {/* <!-- Right Column: Fabric Details --> */}
            <div class="fabric-detail-description">
                <h1>Traditional Bridal Attire</h1>
                <p class="fabric-detail-by-line">by Heritage Bridal</p>

                <p class="fabric-detail-text">
                    This stunning A-line gown is a modern take on traditional bridal wear, crafted from vibrant red Ankara fabric. It features intricate hand-embroidered details along the neckline and hem, accented with subtle pearl beading that catches the light beautifully. The design incorporates traditional craftsmanship to create a timeless piece.
                </p>

                <div class="fabric-detail-specs">
                    <h3>Design Features:</h3>
                    <ul>
                        <li><strong>Silhouette:</strong> Full A-Line Gown</li>
                        <li><strong>Neckline:</strong> Modest High-Neck</li>
                        <li><strong>Fabrics Used:</strong> Hand-embroidered Silk (Ankara Print)</li>
                        <li><strong>Embellishments:</strong> Pearl Accents</li>
                        <li><strong>Fit:</strong> Custom-tailored</li>
                        <li><strong>Occasion:</strong> Bridal, Formal Events</li>
                    </ul>
                </div>

                {/* <!-- Removed Price and CTA section --> */}

            </div>
        </main>

        {/* <!-- 3. Similar Designs Section --> */}
        <section class="fabric-detail-similar-designs">
            <h2>View Similar Styles</h2>

            <div class="fabric-detail-similar-grid">
                
                {/* <!-- Similar Card 1 --> */}
                <a href="#" class="fabric-detail-similar-card">
                    <div class="fabric-detail-similar-card-inner">
                        <img src="https://placehold.co/300x300/D291BC/FFFFFF?text=Mermaid+Gown&font=inter" 
                             alt="Mermaid Gown Style"/>
                        <h3>Mermaid Gown</h3>
                    </div>
                </a>

                {/* <!-- Similar Card 2 --> */}
                <a href="#" class="fabric-detail-similar-card">
                    <div class="fabric-detail-similar-card-inner">
                        <img src="https://placehold.co/300x300/FFC7C7/8E6A6A?text=Evening+Wear&font=inter" 
                             alt="Evening Wear Style"/>
                        <h3>Evening Wear</h3>
                    </div>
                </a>

                {/* <!-- Similar Card 3 --> */}
                <a href="#" class="fabric-detail-similar-card">
                    <div class="fabric-detail-similar-card-inner">
                        <img src="https://placehold.co/300x300/A0E7E5/5A8A89?text=Cocktail+Dress&font=inter" 
                             alt="Cocktail Dress Style"/>
                        <h3>Cocktail Dress</h3>
                    </div>
                </a>

                {/* <!-- Similar Card 4 --> */}
                <a href="#" class="fabric-detail-similar-card">
                    <div class="fabric-detail-similar-card-inner">
                        <img src="https://placehold.co/300x300/F9F871/8B8A40?text=Two-Piece+Set&font=inter" 
                             alt="Two-Piece Set Style"/>
                        <h3>Two-Piece Set</h3>
                    </div>
                </a>

            </div>
        </section>

    </div>
        </>
    )
}
export default LookbookDetails;