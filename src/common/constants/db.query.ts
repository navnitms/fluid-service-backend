const UPDATE_INCIDENT_SEARCH_TERM =
  'UPDATE incident SET search_term = (<TSVECTOR_TERM>) where id = $1';

export default {
  UPDATE_INCIDENT_SEARCH_TERM,
};
