import { useState, useEffect } from 'react';
import { fetchProfile, updateProfile, uploadResume, uploadAvatar } from '../services/userService';
import { upsertCompany, fetchMyCompany, uploadCompanyLogo } from '../services/companyService';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Avatar from '../components/common/Avatar';
import { mediaUrl } from '../utils/mediaUrl';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '', phone: '', location: '', skills: '' });
  const [company, setCompany] = useState({ name: '', website: '', description: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isEmployer = user?.role === 'employer' || user?.role === 'admin';

  const loadProfile = () =>
    fetchProfile().then((p) => {
      setProfile(p);
      setForm({
        name: p.name || '',
        bio: p.bio || '',
        phone: p.phone || '',
        location: p.location || '',
        skills: (p.skills || []).join(', '),
      });
      return p;
    });

  useEffect(() => {
    Promise.all([loadProfile(), isEmployer ? fetchMyCompany() : null])
      .then(([, comp]) => {
        if (comp) setCompany(comp);
        else setCompany({ name: '', website: '', description: '', location: '' });
      })
      .finally(() => setLoading(false));
  }, [isEmployer]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile({
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setProfile(updated);
      if (isEmployer && company.name) {
        const comp = await upsertCompany(company);
        setCompany(comp);
      }
      await refreshUser();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleFile = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      if (type === 'resume') {
        const { resumeUrl } = await uploadResume(file);
        setProfile((p) => ({ ...p, resumeUrl }));
      } else if (type === 'companyLogo') {
        const { company: updated } = await uploadCompanyLogo(file);
        setCompany(updated);
        toast.success('Company logo updated');
      } else {
        const { avatar } = await uploadAvatar(file);
        setProfile((p) => ({ ...p, avatar }));
      }
      await refreshUser();
      if (type !== 'companyLogo') {
        toast.success(type === 'avatar' ? 'Profile photo updated' : 'Resume uploaded');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) return <Spinner />;

  const displayUser = profile || user;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSave} className="card space-y-4">
        <div className="flex items-center gap-5 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <Avatar user={displayUser} size="xl" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{displayUser?.name}</p>
            <p className="text-sm text-gray-500 capitalize">{displayUser?.role}</p>
            <label className="btn-secondary text-sm cursor-pointer mt-3 inline-block">
              {uploading ? 'Uploading…' : 'Change profile photo'}
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => handleFile(e, 'avatar')}
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF · max 5MB</p>
          </div>
        </div>

        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea className="input" placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="input" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <label className="btn-secondary text-sm cursor-pointer inline-block">
          Upload resume (PDF)
          <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFile(e, 'resume')} disabled={uploading} />
        </label>
        {displayUser?.resumeUrl && (
          <a href={mediaUrl(displayUser.resumeUrl)} target="_blank" rel="noreferrer" className="text-sm text-primary-600 block">
            View resume
          </a>
        )}
        {isEmployer && (
          <>
            <hr />
            <h2 className="font-semibold">Company profile</h2>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              {company?.logo ? (
                <img src={mediaUrl(company.logo)} alt="" className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500">
                  {company?.name?.[0] || '?'}
                </div>
              )}
              <label className="btn-secondary text-sm cursor-pointer">
                Upload company logo
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFile(e, 'companyLogo')} disabled={uploading} />
              </label>
            </div>
            <input className="input" placeholder="Company name" value={company?.name || ''} onChange={(e) => setCompany({ ...company, name: e.target.value })} required />
            <input className="input" placeholder="Website" value={company?.website || ''} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
            <input className="input" placeholder="Company location" value={company?.location || ''} onChange={(e) => setCompany({ ...company, location: e.target.value })} />
            <textarea className="input" placeholder="Company description" value={company?.description || ''} onChange={(e) => setCompany({ ...company, description: e.target.value })} />
            {company?._id && (
              <Link to={`/companies/${company._id}`} className="text-sm text-primary-600 hover:underline">
                View public company page →
              </Link>
            )}
          </>
        )}
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
      </form>
    </div>
  );
};

export default Profile;
