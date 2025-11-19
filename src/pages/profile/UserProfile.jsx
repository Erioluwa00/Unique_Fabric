import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Adjust path as needed
import ProfileSidebar from '../../components/ProfileSidebar';
import './UserProfile.css'

const UserProfile = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <div>
                {/* <ProfileSidebar /> */}

                <main className="up-content">
                    <h1>Account Overview</h1>

                    <div className="up-card-grid">
                        <div className="up-card">
                            <h2>Account Details</h2>
                            <p><strong>Name: </strong>{user ? user.name : 'Loading...'}</p>
                            <p><strong>Email: </strong>{user ? user.email : 'Loading...'}</p>
                        </div>

                        <div className="up-card">
                            <h2>Address Book</h2>
                            <p>Your default shipping address:</p>
                            <p className="up-no-address">No default shipping address available.</p>
                            <a href="#" className="up-btn-link">Add default address</a>
                        </div>

                        {/* <div className="up-card">
                            <h2>Store Credit</h2>
                            <p className="up-credit-balance"><i className="fas fa-wallet"></i> Store credit balance: ₦ 0</p>
                        </div> */}

                        <div className="up-card">
                            <h2>Newsletter Preferences</h2>
                            <p>Manage your email communications to stay updated with the latest news and offers.</p>
                            <a href="#" className="up-btn-link">Edit Newsletter preferences</a>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default UserProfile;