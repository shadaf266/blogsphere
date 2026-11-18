
import { useRef, useState } from "react";
import { FiCamera, FiUser, FiMail, FiEdit3, FiSave } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile } from "../services/userService.js";

export default function ProfilePage() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setAvatar(file);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);

      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      }

      const res = await updateProfile(formData);
      setMessage(res.message || "Profile updated successfully.");

      if (res.data?.avatar) {
        setAvatar(res.data.avatar);
        setPreview("");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc =
    preview ||
    (typeof avatar === "string" ? avatar : "") ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=e8f5e9&color=1a8917`;

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-heading">
          <div>
            <span className="profile-eyebrow">ACCOUNT SETTINGS</span>
            <h1>My Profile</h1>
            <p>Manage your personal information and account details.</p>
          </div>
        </div>

        <div className="profile-layout">

          <aside className="profile-sidebar">
            <div className="profile-avatar-wrapper">
              <img
                src={avatarSrc}
                alt="Profile avatar"
                className="profile-avatar"
              />

              <button
                type="button"
                className="avatar-edit-btn"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile picture"
              >
                <FiCamera />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </div>

            <h2>{name || "Your Name"}</h2>
            <p className="profile-email">{user?.email}</p>

            <span className="profile-member-badge">
              <FiUser /> BlogSphere Member
            </span>

            <div className="profile-sidebar-divider" />

            <p className="avatar-hint">
              Upload a profile picture to personalize your account.
            </p>

            <button
              type="button"
              className="avatar-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiCamera /> Change Photo
            </button>

            <span className="avatar-format">
              JPG, PNG or WEBP · Max 5MB
            </span>
          </aside>

          <main className="profile-form-card">
            <div className="profile-card-heading">
              <div>
                <span className="profile-eyebrow">PERSONAL DETAILS</span>
                <h2>Profile Information</h2>
                <p>Update your information below.</p>
              </div>
              <FiEdit3 className="profile-heading-icon" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="profile-form-group">
                <label htmlFor="profile-name">
                  Full Name
                </label>
                <div className="profile-input-wrapper">
                  <FiUser />
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div className="profile-form-group">
                <label htmlFor="profile-email">
                  Email Address
                </label>
                <div className="profile-input-wrapper disabled">
                  <FiMail />
                  <input
                    id="profile-email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />
                </div>
                <small>Your email address cannot be changed here.</small>
              </div>

              <div className="profile-form-group">
                <label htmlFor="profile-bio">
                  About Me
                </label>
                <textarea
                  id="profile-bio"
                  rows="5"
                  maxLength="300"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community a little about yourself..."
                />
                <div className="profile-character-count">
                  {bio.length}/300 characters
                </div>
              </div>

              {message && (
                <p className="profile-message" role="status">
                  {message}
                </p>
              )}

              <div className="profile-form-footer">
                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={loading}
                >
                  <FiSave />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </main>

        </div>
      </div>
    </div>
  );
}
