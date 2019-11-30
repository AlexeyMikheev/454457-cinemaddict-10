const MINUTE_IN_HOUR = 60;

const MIN_DESCRIPTION_LENGTH = 0;
const MAX_DESCRIPTION_LENGTH = 140;
const DESCRIPTION_SPACE = 1;

const MANY_COMMENTS_COUNT = 1;

const getFormatedDuration = (duration) => {
  let formatedDuration = ``;

  if (duration < MINUTE_IN_HOUR) {
    formatedDuration += `${duration}m`;
  } else if (duration === MINUTE_IN_HOUR) {
    formatedDuration += `${duration}h`;
  } else {
    const hours = (duration / MINUTE_IN_HOUR).toFixed(0);
    const minutes = duration % MINUTE_IN_HOUR;
    formatedDuration += `${hours}h ${minutes}m`;
  }

  return formatedDuration;
};

const getEllipsisDescription = (description) =>{
  return (description.length > MAX_DESCRIPTION_LENGTH) ? `${description.substring(MIN_DESCRIPTION_LENGTH, (MAX_DESCRIPTION_LENGTH - DESCRIPTION_SPACE))}...` : description;
};

const getFormatedComments = (commentsCount) =>{
  return commentsCount > MANY_COMMENTS_COUNT ? `${commentsCount} comments` : `${commentsCount} comment`;
};

export {getFormatedDuration, getEllipsisDescription, getFormatedComments};
