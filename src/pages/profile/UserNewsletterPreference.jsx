import React from 'react';
import './UserNewsletterPreference.css'
const UserNewsletterPreference = () => {
    return(
        <>
            <div class="nl-page-container">
        <h1 class="nl-page-title">Newsletter Preferences</h1>
        
        <form action="#" method="POST">
            
            <h3 class="nl-section-header">Define your preferences</h3>

            <div class="nl-input-group">
                {/* <!-- Radio Option 1 --> */}
                <div class="nl-frequency-option">
                    <input type="radio" id="daily-yes" name="newsletter-frequency" value="daily-yes" checked/>
                    <label for="daily-yes">I want to receive daily newsletters</label>
                </div>

                {/* <!-- Radio Option 2 --> */}
                <div class="nl-frequency-option">
                    <input type="radio" id="daily-no" name="newsletter-frequency" value="daily-no" />
                    <label for="daily-no">I don't want to receive daily newsletters</label>
                </div>
            </div>

            {/* <!-- Policy Checkbox --> */}
            <div class="nl-input-group nl-policy-checkbox">
                <input type="checkbox" id="policy-agree" name="policy-agree" required/>
                <label for="policy-agree" class="nl-consent-text">
                    I agree to Unique Fabric's Privacy and Cookie Policy. You can unsubscribe from newsletters at any time.
                    <br/>
                    <a href="#" class="nl-terms-link">I accept the Legal Terms</a>
                </label>
            </div>

            {/* <!-- Save Button --> */}
            <div class="nl-btn-wrapper">
                <button type="submit" class="nl-save-btn">Save</button>
            </div>
            
        </form>
    </div>

        </>
    )
}
export default UserNewsletterPreference;