import React from "react";
import "./FabricCare.css"
const FabricCare= () =>{
    return(
        <>
              <div className="policy-hero">
        <div className="policy-hero-content">
          <h1>Fabric Care Guide</h1>
          <p className="hero-subtitle">Fast, reliable delivery for all your fabric needs</p>
        </div>
      </div>
            <div class="fc-page-container">
        
        <header class="fc-header">
            <h2 class="fc-main-title">The Ultimate Fabric Care Guide</h2>
            <p class="fc-subtitle">Essential washing, drying, and storage tips for your favorite garments.</p>
        </header>

        <section class="fc-fabric-grid">

            {/* <!-- Cotton Care Card --> */}
            <article class="fc-fabric-card">
                <h2 class="fc-fabric-name">Cotton</h2>
                <ul class="fc-care-list">
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Wash white cotton in warm or hot water. Colored cotton should be washed in cold water to prevent fading.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Use an all-purpose detergent. Bleach is safe for white cotton but avoid it on colors.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Tumble dry on a medium setting. Remove promptly to reduce wrinkles, or hang dry to save energy.</span>
                    </li>
                </ul>
            </article>

            {/* <!-- Silk Care Card --> */}
            <article class="fc-fabric-card">
                <h2 class="fc-fabric-name">Silk</h2>
                <ul class="fc-care-list">
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">**Hand washing is recommended** using a gentle detergent specifically for delicates.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Avoid twisting or wringing the fabric. Rinse thoroughly with cold water.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Air dry away from direct sunlight, which can fade and damage the fibers. Never use a machine dryer.</span>
                    </li>
                </ul>
            </article>

            {/* <!-- Wool Care Card --> */}
            <article class="fc-fabric-card">
                <h2 class="fc-fabric-name">Wool</h2>
                <ul class="fc-care-list">
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Dry clean most tailored wool items. For sweaters, hand wash or use the delicate cycle with cold water.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Use a detergent designed for wool or delicates. **Avoid standard laundry detergents** as they can damage fibers.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Lay the garment flat on a towel to dry, reshaping it gently. Do not hang, as this can stretch the shape.</span>
                    </li>
                </ul>
            </article>

            {/* <!-- Denim Care Card --> */}
            <article class="fc-fabric-card">
                <h2 class="fc-fabric-name">Denim</h2>
                <ul class="fc-care-list">
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Wash as infrequently as possible to maintain color and shape. Turn inside out before washing.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Use cold water and a minimal amount of detergent. Wash separately for the first few cycles.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Hang dry is highly recommended to prevent shrinkage and preserve fit. Use the dryer sparingly.</span>
                    </li>
                </ul>
            </article>
            
            {/* <!-- Linen Care Card (New) --> */}
            <article class="fc-fabric-card">
                <h2 class="fc-fabric-name">Linen</h2>
                <ul class="fc-care-list">
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Machine wash on a gentle cycle in cool or lukewarm water. Hot water can cause shrinkage.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Use a mild detergent. Avoid bleach, even for white linen, as it can weaken the fibers.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Air dry by laying flat or hanging. Iron while the fabric is still slightly damp for the best results.</span>
                    </li>
                </ul>
            </article>

            {/* <!-- Polyester Care Card (New) --> */}
            <article class="fc-fabric-card">
                <h2 class="fc-fabric-name">Polyester</h2>
                <ul class="fc-care-list">
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Machine wash in warm water. Avoid hot water, which can set stains and increase static cling.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Standard liquid or powder detergent works well. Fabric softener can help reduce static.</span>
                    </li>
                    <li class="fc-care-tip">
                        <span class="fc-tip-icon">&#10003;</span>
                        <span class="fc-tip-text">Tumble dry on low heat or hang dry. Polyester dries very quickly and high heat can cause damage or melting.</span>
                    </li>
                </ul>
            </article>

        </section>

        {/* <!-- FAQ Section (New) --> */}
        <section class="fc-faq-section">
            <h2 class="fc-faq-title">Frequently Asked Questions</h2>

            {/* <!-- FAQ Item 1 --> */}
            <div class="fc-faq-item">
                <button class="fc-faq-question" data-target="faq-1">
                    Why is cold water better for most clothes?
                    <span class="fc-faq-icon">+</span>
                </button>
                <div id="faq-1" class="fc-faq-answer">
                    <p>Cold water helps prevent **colors from bleeding and fading**, significantly reduces the chance of **shrinking fabrics**, and is much more **energy-efficient** than hot water. It's the best default choice for dark colors and delicates.</p>
                </div>
            </div>
            
            {/* <!-- FAQ Item 2 --> */}
            <div class="fc-faq-item">
                <button class="fc-faq-question" data-target="faq-2">
                    Should I use fabric softener on all fabrics?
                    <span class="fc-faq-icon">+</span>
                </button>
                <div id="faq-2" class="fc-faq-answer">
                    <p>No. Fabric softener can leave residue that clogs the absorbent fibers of **towels** and **athletic wear**, making them less effective. Avoid it on these items and on flame-resistant children's sleepwear.</p>
                </div>
            </div>

            {/* <!-- FAQ Item 3 --> */}
            <div class="fc-faq-item">
                <button class="fc-faq-question" data-target="faq-3">
                    What is the best way to remove a common stain like coffee?
                    <span class="fc-faq-icon">+</span>
                </button>
                <div id="faq-3" class="fc-faq-answer">
                    <p>The key is to act fast. First, **blot (do not rub)** the stain with a clean cloth. Then, soak the area in **cold water**. Apply a small amount of liquid laundry detergent directly to the stain and gently rub before washing normally.</p>
                </div>
            </div>

            {/* <!-- FAQ Item 4 --> */}
            <div class="fc-faq-item">
                <button class="fc-faq-question" data-target="faq-4">
                    How do I prevent pilling on my knitwear and sweaters?
                    <span class="fc-faq-icon">+</span>
                </button>
                <div id="faq-4" class="fc-faq-answer">
                    <p>To prevent pilling (the formation of small balls of fiber), always **turn your garments inside out** before washing. Use the **gentle cycle** and avoid mixing heavy fabrics (like denim) with soft ones (like wool). You can remove existing pills with a fabric shaver.</p>
                </div>
            </div>

            {/* <!-- FAQ Item 5 --> */}
            <div class="fc-faq-item">
                <button class="fc-faq-question" data-target="faq-5">
                    What does the "Dry Clean Only" tag actually mean?
                    <span class="fc-faq-icon">+</span>
                </button>
                <div id="faq-5" class="fc-faq-answer">
                    <p>It means the item's material (like certain silks, wools, or items with structured tailoring) is likely too delicate for water or machine agitation. Ignoring this risks damage, severe **shrinkage**, or loss of the garment's original shape. It's best to follow the label.</p>
                </div>
            </div>

        </section>

    </div>
        </>
    )
}
export default FabricCare;