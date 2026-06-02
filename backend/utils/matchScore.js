const calcMatchScore = (user, job) => {
  if (!user || !job) return 0;

  let score = 0;
  const weights = { skills: 50, experience: 25, location: 15, type: 10 };

  const userSkills = (user.skills || []).map((s) => s.toLowerCase());
  const jobSkills = (job.skills || []).map((s) => s.toLowerCase());

  if (jobSkills.length > 0 && userSkills.length > 0) {
    const matched = jobSkills.filter((js) =>
      userSkills.some((us) => us.includes(js) || js.includes(us))
    );
    score += (matched.length / jobSkills.length) * weights.skills;
  } else if (userSkills.length > 0) {
    score += weights.skills * 0.3;
  }

  const expOrder = ['entry', 'mid', 'senior', 'lead'];
  const userExp = expOrder.indexOf(user.experience || 'entry');
  const jobExp = expOrder.indexOf(job.experience || 'entry');
  if (userExp >= 0 && jobExp >= 0) {
    const diff = Math.abs(userExp - jobExp);
    score += Math.max(0, weights.experience - diff * 8);
  }

  if (user.location && job.location) {
    const ul = user.location.toLowerCase();
    const jl = job.location.toLowerCase();
    if (ul === jl || jl.includes(ul) || ul.includes(jl) || job.type === 'remote') {
      score += weights.location;
    }
  } else if (job.type === 'remote') {
    score += weights.location;
  }

  score += weights.type * 0.5;

  return Math.min(100, Math.round(score));
};

const rankJobsForUser = (user, jobs, appliedJobIds = []) => {
  return jobs
    .filter((j) => !appliedJobIds.includes(j._id.toString()))
    .map((job) => ({
      ...job.toObject?.() || job,
      matchScore: calcMatchScore(user, job),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};

const generateCoverLetter = (user, job) => {
  const skills = (user.skills || []).slice(0, 6).join(', ');
  const matched = (job.skills || [])
    .filter((js) =>
      (user.skills || []).some(
        (us) => us.toLowerCase().includes(js.toLowerCase()) || js.toLowerCase().includes(us.toLowerCase())
      )
    )
    .slice(0, 5)
    .join(', ');

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With my background and skills, I am confident I would be a valuable addition to your team.

${user.bio ? `${user.bio}\n\n` : ''}${matched ? `My experience aligns closely with your requirements, particularly in: ${matched}. ` : ''}${skills ? `I bring expertise in ${skills}. ` : ''}I am excited about the opportunity to contribute to ${job.company} and would welcome the chance to discuss how my profile fits your needs.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${user.name}
${user.email}${user.phone ? `\n${user.phone}` : ''}${user.location ? `\n${user.location}` : ''}`;
};

module.exports = { calcMatchScore, rankJobsForUser, generateCoverLetter };
