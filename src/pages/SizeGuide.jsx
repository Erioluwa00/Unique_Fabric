import React from "react";
import "./SizeGuide.css"
const SizeGuide=()=>{
    return(
        <>

        
              <div className="policy-hero">
        <div className="policy-hero-content">
          <h1>Fabric Size Guide</h1>
          <p className="hero-subtitle">Fast, reliable delivery for all your fabric needs</p>
        </div>
      </div>
              <div class="fsg-page-container">
        
        <header class="fsg-header">
            <h1 class="fsg-main-title">Official Garment Size Guide</h1>
            <p class="fsg-subtitle">Find your perfect fit with our comprehensive body measurements and sizing charts.</p>
        </header>

        {/* <!-- Measurement Guide --> */}
        <section class="fsg-guide-section">
            <h2 class="fsg-guide-title">How to Take Your Measurements</h2>
            
            <div class="fsg-measure-steps">
                <div class="fsg-step-item">
                    <h4>Chest/Bust</h4>
                    <p>Measure around the fullest part of your chest, keeping the tape horizontal and under the arms. This is crucial for **tops and jackets**.</p>
                </div>
                <div class="fsg-step-item">
                    <h4>Waist</h4>
                    <p>Measure around the narrowest part of your waistline, typically just above the navel. Keep the tape slightly loose for comfort. This guides **pants and fitted dresses**.</p>
                </div>
                <div class="fsg-step-item">
                    <h4>Hips</h4>
                    <p>Measure around the fullest part of your hips and rear. Stand with your feet together for the most accurate reading. Essential for **bottoms and skirts**.</p>
                </div>
                {/* <!-- New Measurement 1: Shoulder Width --> */}
                <div class="fsg-step-item">
                    <h4>Shoulder Width</h4>
                    <p>Measure straight across the back from the edge of one shoulder bone to the edge of the other. Critical for tailored shirts and jackets to ensure a proper **fit in the sleeve**. </p>
                </div>
                {/* <!-- New Measurement 2: Torso/Girth --> */}
                <div class="fsg-step-item">
                    <h4>Torso Girth (For Jumpsuits)</h4>
                    <p>For one-piece items, measure from the highest point of the shoulder, down through the crotch, and up the back to the shoulder where you started. This determines **vertical fit** and prevents pulling.</p>
                </div>
            </div>
        </section>

        {/* <!-- Size Charts Section --> */}
        <section class="fsg-chart-section">
            <h2 class="fsg-guide-title">Sizing Charts (Inches)</h2>

            {/* <!-- Tabs Navigation --> */}
            <div class="fsg-tabs-nav">
                <button class="fsg-tab-button active" data-target="tops-chart">Tops & Shirts</button>
                <button class="fsg-tab-button" data-target="bottoms-chart">Bottoms & Pants</button>
                <button class="fsg-tab-button" data-target="dresses-chart">Dresses</button>
                {/* <!-- New Tab for Jumpsuits --> */}
                <button class="fsg-tab-button" data-target="jumpsuits-chart">Jumpsuits</button>
            </div>
            
            <div class="fsg-chart-content">
                
                {/* <!-- Tops Chart Panel (Existing) --> */}
                <div id="tops-chart" class="fsg-chart-panel visible">
                    <table class="fsg-size-table">
                        <thead>
                            <tr class="fsg-table-header">
                                <th>Size</th>
                                <th>US</th>
                                <th>EU</th>
                                <th>Chest (in)</th>
                                <th>Waist (in)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">XS</td>
                                <td class="fsg-table-data">0-2</td>
                                <td class="fsg-table-data">32-34</td>
                                <td class="fsg-table-data">32-34</td>
                                <td class="fsg-table-data">24-26</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">S</td>
                                <td class="fsg-table-data">4-6</td>
                                <td class="fsg-table-data">36-38</td>
                                <td class="fsg-table-data">35-37</td>
                                <td class="fsg-table-data">27-29</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">M</td>
                                <td class="fsg-table-data">8-10</td>
                                <td class="fsg-table-data">40-42</td>
                                <td class="fsg-table-data">38-40</td>
                                <td class="fsg-table-data">30-32</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">L</td>
                                <td class="fsg-table-data">12-14</td>
                                <td class="fsg-table-data">44-46</td>
                                <td class="fsg-table-data">41-43</td>
                                <td class="fsg-table-data">33-35</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* <!-- Bottoms Chart Panel (Existing) --> */}
                <div id="bottoms-chart" class="fsg-chart-panel">
                    <table class="fsg-size-table">
                        <thead>
                            <tr class="fsg-table-header">
                                <th>Size</th>
                                <th>Waist (in)</th>
                                <th>Hips (in)</th>
                                <th>Inseam (in)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">28</td>
                                <td class="fsg-table-data">28-29</td>
                                <td class="fsg-table-data">34-36</td>
                                <td class="fsg-table-data">30-32</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">30</td>
                                <td class="fsg-table-data">30-31</td>
                                <td class="fsg-table-data">36-38</td>
                                <td class="fsg-table-data">31-33</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">32</td>
                                <td class="fsg-table-data">32-33</td>
                                <td class="fsg-table-data">38-40</td>
                                <td class="fsg-table-data">32-34</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">34</td>
                                <td class="fsg-table-data">34-35</td>
                                <td class="fsg-table-data">40-42</td>
                                <td class="fsg-table-data">33-35</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                {/* <!-- Dresses Chart Panel (Existing) --> */}
                <div id="dresses-chart" class="fsg-chart-panel">
                    <table class="fsg-size-table">
                        <thead>
                            <tr class="fsg-table-header">
                                <th>Size</th>
                                <th>UK</th>
                                <th>Bust (in)</th>
                                <th>Waist (in)</th>
                                <th>Hips (in)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">8</td>
                                <td class="fsg-table-data">10</td>
                                <td class="fsg-table-data">34</td>
                                <td class="fsg-table-data">26</td>
                                <td class="fsg-table-data">36</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">10</td>
                                <td class="fsg-table-data">12</td>
                                <td class="fsg-table-data">36</td>
                                <td class="fsg-table-data">28</td>
                                <td class="fsg-table-data">38</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">12</td>
                                <td class="fsg-table-data">14</td>
                                <td class="fsg-table-data">38</td>
                                <td class="fsg-table-data">30</td>
                                <td class="fsg-table-data">40</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">14</td>
                                <td class="fsg-table-data">16</td>
                                <td class="fsg-table-data">40</td>
                                <td class="fsg-table-data">32</td>
                                <td class="fsg-table-data">42</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* <!-- Jumpsuits Chart Panel (New) --> */}
                <div id="jumpsuits-chart" class="fsg-chart-panel">
                    <table class="fsg-size-table">
                        <thead>
                            <tr class="fsg-table-header">
                                <th>Size</th>
                                <th>Bust (in)</th>
                                <th>Waist (in)</th>
                                <th>Hips (in)</th>
                                <th>Torso Girth (in)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">XS</td>
                                <td class="fsg-table-data">32-33</td>
                                <td class="fsg-table-data">24-25</td>
                                <td class="fsg-table-data">34-35</td>
                                <td class="fsg-table-data">56-58</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">S</td>
                                <td class="fsg-table-data">34-35</td>
                                <td class="fsg-table-data">26-27</td>
                                <td class="fsg-table-data">36-37</td>
                                <td class="fsg-table-data">59-61</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">M</td>
                                <td class="fsg-table-data">36-37</td>
                                <td class="fsg-table-data">28-29</td>
                                <td class="fsg-table-data">38-39</td>
                                <td class="fsg-table-data">62-64</td>
                            </tr>
                            <tr class="fsg-table-row">
                                <td class="fsg-table-data">L</td>
                                <td class="fsg-table-data">38-40</td>
                                <td class="fsg-table-data">30-32</td>
                                <td class="fsg-table-data">40-42</td>
                                <td class="fsg-table-data">65-67</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
        
        {/* <!-- Extra Content Section (New) --> */}
        <section class="fsg-extra-content-section">
            <h2 class="fsg-extra-content-title">Pro Sizing Tips & Conversions</h2>
            
            <ul class="fsg-tip-list">
                <li class="fsg-tip-item">
                    <h5>Choosing Between Sizes</h5>
                    <p>If your measurements fall between two sizes, always select the **larger size**. It's easier and cheaper to have a garment taken in than to let it out.</p>
                </li>
                <li class="fsg-tip-item">
                    <h5>The Importance of Torso Length</h5>
                    <p>For one-piece items like swimwear or jumpsuits, the **torso girth** is often the most critical measurement. Prioritizing this prevents a strained fit at the shoulders or crotch.</p>
                </li>
                <li class="fsg-tip-item">
                    <h5>US to International Conversion</h5>
                    <p>Sizes are often inconsistent. For quick reference, a US size 8 typically correlates to a UK 12 and a European (EU) 40, though this can vary by brand.</p>
                </li>
                <li class="fsg-tip-item">
                    <h5>Measuring in Centimeters</h5>
                    <p>To convert from Inches to Centimeters, simply multiply the measurement by 2.54. Check the size guide's labels to ensure you're using the correct unit.</p>
                </li>
            </ul>
        </section>

    </div>
        </>
    )
}
export default SizeGuide;