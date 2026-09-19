import { useState, useRef } from "react";
import { User, Building2, Briefcase, Camera } from "lucide-react";
import { updateProfile, uploadAvatar, deleteAvatar } from "../../api/user.api";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";

export default function ProfileTab({ user, setUser, setApiError, setSuccessMessage }) {
    const fileInputRef = useRef(null);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        company: user?.company || "",
        designation: user?.designation || "",
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isAvatarLoading, setIsAvatarLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        setApiError(null);
    };

    const validate = () => {
        const newErrors = {};
        const name = profileData.name.trim();
        const company = profileData.company.trim();
        const designation = profileData.designation.trim();

        if (!name || name.length < 2 || name.length > 30 || !/^[a-zA-Z\s]+$/.test(name)) {
            newErrors.name = "Full name must be 2-30 letters and spaces only";
        }
        if (!company || company.length < 2 || company.length > 100 || !/^[a-zA-Z0-9\s.&-]+$/.test(company)) {
            newErrors.company = "Company must be between 2 and 100 valid characters";
        }
        if (!designation || designation.length < 2 || designation.length > 100 || !/^[a-zA-Z0-9\s.&-]+$/.test(designation)) {
            newErrors.designation = "Designation must be between 2 and 100 valid characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (isSaving || !validate()) return;

        try {
            setIsSaving(true);
            setApiError(null);
            const res = await updateProfile({
                name: profileData.name.trim(),
                company: profileData.company.trim(),
                designation: profileData.designation.trim(),
            });
            setUser(res.data);
            setSuccessMessage("Profile details updated successfully!");
        } catch (err) {
            setApiError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
            setApiError("Only JPG, PNG, and WebP images are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setApiError("Avatar image size must be under 5MB.");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setIsAvatarLoading(true);
            setApiError(null);
            const res = await uploadAvatar(formData);
            setUser(res.data);
            setSuccessMessage("Avatar uploaded successfully!");
        } catch (err) {
            setApiError(err.response?.data?.message || "Failed to upload avatar.");
        } finally {
            setIsAvatarLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleAvatarDelete = async () => {
        if (!user?.avatar?.url) return;
        try {
            setIsAvatarLoading(true);
            setApiError(null);
            const res = await deleteAvatar();
            setUser(res.data);
            setSuccessMessage("Avatar removed successfully.");
        } catch (err) {
            setApiError(err.response?.data?.message || "Failed to remove avatar.");
        } finally {
            setIsAvatarLoading(false);
        }
    };

    const hasChanged =
        profileData.name !== (user?.name || "") ||
        profileData.company !== (user?.company || "") ||
        profileData.designation !== (user?.designation || "");

    return (
        <Card className="p-7">
            <div className="border-b border-white/10 pb-5">
                <h2 className="text-xl font-semibold text-white">Profile Details</h2>
                <p className="mt-1 text-xs text-zinc-400">
                    Update your public name, organization information, and avatar photo.
                </p>
            </div>

            {/* Avatar Section */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6 border-b border-white/10 pb-7">
                <div className="relative group">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-white/15 bg-gradient-to-br from-zinc-800 to-zinc-950 text-2xl font-bold text-white shadow-xl overflow-hidden">
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt={user?.name || "Avatar"} className="h-full w-full object-cover" />
                        ) : (
                            <span>{user?.name ? user.name.charAt(0).toUpperCase() : "R"}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAvatarLoading}
                        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-zinc-900/90 text-white shadow-lg transition hover:bg-zinc-800 hover:scale-105 cursor-pointer disabled:opacity-50"
                        title="Upload photo"
                    >
                        <Camera size={15} />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white">Avatar Photo</h3>
                    <p className="text-xs text-zinc-400">Accepts JPG, PNG, or WebP. Maximum size is 5MB.</p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <Button type="button" variant="secondary" className="!px-3.5 !py-1.5 text-xs" onClick={() => fileInputRef.current?.click()} disabled={isAvatarLoading} loading={isAvatarLoading}>
                            Upload Photo
                        </Button>
                        {user?.avatar?.url && (
                            <button type="button" onClick={handleAvatarDelete} disabled={isAvatarLoading} className="text-xs font-medium text-red-400 hover:text-red-300 transition cursor-pointer disabled:opacity-50">
                                Remove Photo
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Input label="Full Name" name="name" value={profileData.name} onChange={handleChange} placeholder="Enter your full name" error={errors.name} endElement={<User size={18} />} />
                    </div>
                    <div>
                        <Input label="Company Name" name="company" value={profileData.company} onChange={handleChange} placeholder="Enter your company name" error={errors.company} endElement={<Building2 size={18} />} />
                    </div>
                    <div>
                        <Input label="Designation / Role" name="designation" value={profileData.designation} onChange={handleChange} placeholder="Enter your job title" error={errors.designation} endElement={<Briefcase size={18} />} />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <Button type="submit" disabled={!hasChanged || isSaving} loading={isSaving} loadingText="Saving Changes...">
                        Save Changes
                    </Button>
                </div>
            </form>
        </Card>
    );
}
