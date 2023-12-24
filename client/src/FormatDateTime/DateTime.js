import moment from "moment";

// Function to format date and time
const formatDateTime = (dateTimeString) => {
    const formattedDateTime = moment(dateTimeString.slice(0, -5)).format('MMM D, YYYY');
    return formattedDateTime;
};

export default formatDateTime;