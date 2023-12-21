import moment from "moment";

// Function to format date and time
const formatDateTime = (dateTimeString) => {
    // console.log(dateTimeString)
    const date = new Date();
    console.log(date)
    const formattedDateTime = moment(dateTimeString.slice(0, -5)).format('MMM D, YYYY');
    return formattedDateTime;
};

export default formatDateTime;