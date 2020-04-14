const covid19ImpactEstimator = (data) => {
  const input = {
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71
    },
    periodType: 'days',
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
  };
  
  let getFactor;

  // getting the time to elapse in days
  switch (input.periodType.trim().toLowerCase()) {
    case 'months':
      getFactor = Math.trunc((input.timeToElapse * 30) / 3);
      break;
    case 'weeks':
      getFactor = Math.trunc((input.timeToElapse * 7) / 3);
      break;
    case 'days':
      getFactor = Math.trunc((input.timeToElapse) / 3);
      break;
      default:
  }

  // currently Infected cases for impact and severe impact
  const currentlyInfected = Math.trunc(input.reportedCases * 10);
  const severeCurrentlyInfected = Math.trunc(input.reportedCases * 50);

  // infections by requested time for impact and severe impact
  const infectionsByRequestedTime = Math.trunc(currentlyInfected * (2 ** getFactor));
  const severeInfectionsByRequestedTime = Math.trunc(severeCurrentlyInfected * (2 ** getFactor));

  // severe cases by requested time for impact and severe impact
  const severeCasesByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.15);
  const severeSevereCasesByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.15);

  // hospital beds by requested time for impact and severe impact
  const AvailableBeds = Math.trunc(input.totalHospitalBeds * 0.35);
  const hospitalBedsByRequestedTime = Math.trunc(AvailableBeds - severeCasesByRequestedTime);
  const severeHospitalBedsByRequestedTime = Math.trunc(AvailableBeds - severeSevereCasesByRequestedTime);

  // cases of ICU for impact and severe impact
  const casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.05);
  const severeCasesForICUByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.05);

  // cases that requires ventilation
  const casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);
  const severeCasesForVentilatorsByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.02);

  // money to be lost by economy
  const dollarInFlight = Math.trunc(infectionsByRequestedTime * input.region.avgDailyIncomeInUSD * timeToElapse);
  const cal = severeInfectionsByRequestedTime * input.region.avgDailyIncomeInUSD;
  const severeDollarInFlight = Math.trunc(cal * tEF(input));

  return {
    data: input,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime: infectionsByRequestedTime,
      severeCasesByRequestedTime: severeCasesByRequestedTime,
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime,
      casesForICUByRequestedTime: casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTime,
      dollarInFlight: dollarInFlight
    },
    severeImpact: {
      currentlyInfected,
      infectionsByRequestedTime: severeInfectionsByRequestedTime,
      severeCasesByRequestedTime: severeSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: severeHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: severeCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: severeCasesForVentilatorsByRequestedTime,
      dollarInFlight: severeDollarInFlight
    }
  };
};
console.log(covid19ImpactEstimator())
//export default covid19ImpactEstimator;
