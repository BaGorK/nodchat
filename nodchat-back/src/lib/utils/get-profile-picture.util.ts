export function getProfilePicture(gender: 'male' | 'female', username: string) {
  if (gender === 'male') {
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    return boyProfilePic;
  } else {
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    return girlProfilePic;
  }
}
