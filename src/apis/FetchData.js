export const fetchPersonData = async (getEthosQuery) => {

  const data = await getEthosQuery({ queryId: 'getPersons' }); 
//   localStorage.setItem('personData', JSON.stringify(data));
  return data;
};

export const fetchReports = async () => {
    const res = await fetch('http://localhost:5000/api/reports');
    const data = await res.json();
    return data.map(r => r.name);
};