const covid19ImpactEstimator = (data) => {
  const {
    region: {
      name,
      avgAge,
      avgDailyIncomeInUSD,
      avgDailyIncomePopulation
    },
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  } = data;

  let getFactor;

  // getting the time to elapse in days
  switch (periodType.trim().toLowerCase()) {
    case 'months':
      getFactor = Math.trunc((timeToElapse * 30) / 3);
      break;
    case 'weeks':
      getFactor = Math.trunc((timeToElapse * 7) / 3);
      break;
    case 'days':
      getFactor = Math.trunc((timeToElapse) / 3);
      break;
    default:
  }

  // currently Infected cases for impact and severe impact
  const currentlyInfected = Math.trunc(reportedCases * 10);
  const severeCurrentlyInfected = Math.trunc(reportedCases * 50);

  // infections by requested time for impact and severe impact
  const infectionsByRequestedTime = Math.trunc(currentlyInfected * (2 ** getFactor));
  const severeInfectionsByRequestedTime = Math.trunc(severeCurrentlyInfected * (2 ** getFactor));

  // severe cases by requested time for impact and severe impact
  const severeCasesByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.15);
  const severeSevereCasesByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.15);

  // hospital beds by requested time for impact and severe impact
  const aB = Math.trunc(totalHospitalBeds * 0.35);
  const hospitalBedsByRequestedTime = Math.trunc(aB - severeCasesByRequestedTime);
  const severeHospitalBedsByRequestedTime = Math.trunc(aB - severeSevereCasesByRequestedTime);

  // cases of ICU for impact and severe impact
  const casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.05);
  const severeCasesForICUByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.05);

  // cases that requires ventilation
  const casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);
  const severeCasesForVentilatorsByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.02);

  // money to be lost by economy
  const dollarInFlight = Math.trunc(infectionsByRequestedTime * input.region.avgDailyIncomeInUSD * getFactor);
  const cal = severeInfectionsByRequestedTime * input.region.avgDailyIncomeInUSD;
  const severeDollarInFlight = Math.trunc(cal * getFactor);

  return {
    data: input,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime,
      dollarInFlight
    },
    severeImpact: {
      currentlyInfected = severeCurrentlyInfected,
      infectionsByRequestedTime: severeInfectionsByRequestedTime,
      severeCasesByRequestedTime: severeSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: severeHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: severeCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: severeCasesForVentilatorsByRequestedTime,
      dollarInFlight: severeDollarInFlight
    }
  };
};

export default covid19ImpactEstimator;
