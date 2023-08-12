import { TS_VECTOR_TEMPLATE } from '../constants/ts.vector.constants';

export function getTsVector(
  fieldValue: string,
  label: 'A' | 'B' | 'C' | 'D',
  regConfig?: 'simple',
): string {
  fieldValue = fieldValue?.replace(/[^a-zA-Z0-9_. ]/g, ' ');
  fieldValue = fieldValue?.trim();
  if (!fieldValue || !label) {
    fieldValue = '';
  }
  let newString = TS_VECTOR_TEMPLATE.replace('<FIELD>', `${fieldValue}`);
  newString = newString.replace('<LABEL>', `${label}`);
  if (regConfig) {
    newString = newString.replace('<REGCONFIG>', regConfig);
  } else {
    newString = newString.replace(`'<REGCONFIG>', `, '');
  }

  return newString;
}

export function buildTsQueryTerm(searchTerm: string) {
  searchTerm = searchTerm?.replace(/[^a-zA-Z0-9_. ]/g, ' ');
  searchTerm = searchTerm?.trim();
  const terms: string[] = searchTerm.split(' ').filter((w) => w !== '');
  let queryString = '';
  for (const [idx, term] of terms.entries()) {
    queryString += ` ${term}:*`;
    if (idx < terms.length - 1) {
      queryString += ' &';
    }
  }
  return queryString;
}
