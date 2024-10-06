import axios from 'axios';
import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from '@env';

const pinataApiUrl = 'https://api.pinata.cloud';

const pinataAxios = axios.create({
  baseURL: pinataApiUrl,
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_API_KEY
  }
});

export const getAllUsers = async () => {
  try {
    const response = await pinataAxios.get('/data/pinList?status=pinned&metadata[name]=users.json');
    if (response.data.rows.length > 0) {
      const usersFileHash = response.data.rows[0].ipfs_pin_hash;
      const usersResponse = await pinataAxios.get(`/data/${usersFileHash}`);
      return usersResponse.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const addToCircle = async (userId, targetUserId) => {
  try {
    // Fetch the user's data
    const userResponse = await pinataAxios.get('/data/pinList?status=pinned&metadata[name]=user_' + userId + '.json');
    if (userResponse.data.rows.length === 0) {
      throw new Error('User not found');
    }
    const userFileHash = userResponse.data.rows[0].ipfs_pin_hash;
    const userData = await pinataAxios.get(`/data/${userFileHash}`);
    
    // Add targetUserId to the user's circle if not already present
    if (!userData.data.circle) {
      userData.data.circle = [];
    }
    if (!userData.data.circle.includes(targetUserId)) {
      userData.data.circle.push(targetUserId);
    }

    // Update the user's data in Pinata
    await pinataAxios.put(`/pinning/pinJSONToIPFS`, userData.data, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        pinataMetadata: JSON.stringify({
          name: 'user_' + userId + '.json'
        })
      }
    });

    return userData.data.circle;
  } catch (error) {
    console.error('Error adding user to circle:', error);
    throw error;
  }
};

export const removeFromCircle = async (userId, targetUserId) => {
  try {
    // Fetch the user's data
    const userResponse = await pinataAxios.get('/data/pinList?status=pinned&metadata[name]=user_' + userId + '.json');
    if (userResponse.data.rows.length === 0) {
      throw new Error('User not found');
    }
    const userFileHash = userResponse.data.rows[0].ipfs_pin_hash;
    const userData = await pinataAxios.get(`/data/${userFileHash}`);
    
    // Remove targetUserId from the user's circle
    if (userData.data.circle) {
      userData.data.circle = userData.data.circle.filter(id => id !== targetUserId);
    }

    // Update the user's data in Pinata
    await pinataAxios.put(`/pinning/pinJSONToIPFS`, userData.data, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        pinataMetadata: JSON.stringify({
          name: 'user_' + userId + '.json'
        })
      }
    });

    return userData.data.circle;
  } catch (error) {
    console.error('Error removing user from circle:', error);
    throw error;
  }
};

export const deleteUserData = async (userId) => {
  try {
    const response = await pinataAxios.delete(`/pinning/unpin/user_${userId}.json`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
};

export const saveUserData = async (userData) => {
  try {
    const response = await pinataAxios.post('/pinning/pinJSONToIPFS', userData, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        pinataMetadata: JSON.stringify({
          name: `user_${userData.userId}.json`
        })
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};