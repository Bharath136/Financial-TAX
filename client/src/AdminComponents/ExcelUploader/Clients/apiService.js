// apiService.js
import axios from 'axios';

import domain from '../../domain/domain';

export const fetchUserData = async (url, token) => {
    try {
        const response = await axios.get(`${domain.domain}${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const deleteUserData = async (url, id, token) => {
    try {
        await axios.delete(`${domain.domain}${url}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};

export const fetchAssignedClients = async (url, token) => {
    try {
        const response = await axios.get(`${domain.domain}${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching assigned clients:', error);
        throw error;
    }
};
