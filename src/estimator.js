const covid19ImpactEstimator = (data) => {
  const {
    region: {
      avgDailyIncomeInUSD
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
  const aB = totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = Math.trunc(aB - severeCasesByRequestedTime);
  const severeHospitalBedsByRequestedTime = Math.trunc(aB - severeSevereCasesByRequestedTime);

  // cases of ICU for impact and severe impact
  const casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.05);
  const severeCasesForICUByRequestedTime = Math.trunc(severeInfectionsByRequestedTime * 0.05);

  // cases that requires ventilation
  const casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);
  const solve = severeInfectionsByRequestedTime * 0.02;
  const severeCasesForVentilatorsByRequestedTime = Math.trunc(solve);

  // money to be lost by economy
  let day;
  let dollarInFlight;
  let severeDollarInFlight;
  const compute = population * avgDailyIncomeInUSD;
  if (periodType === 'months') {
    day = timeToElapse * 30;
    dollarInFlight = Math.trunc((infectionsByRequestedTime * compute) / day);
    severeDollarInFlight = Math.trunc((severeInfectionsByRequestedTime * compute) / day);
  } else if (periodType === 'weeks') {
    day = timeToElapse * 7;
    dollarInFlight = Math.trunc((infectionsByRequestedTime * compute) / day);
    severeDollarInFlight = Math.trunc((severeInfectionsByRequestedTime * compute) / day);
  } else if (periodType === 'days') {
    day = timeToElapse * 1;
    dollarInFlight = Math.trunc((infectionsByRequestedTime * compute) / day);
    severeDollarInFlight = Math.trunc((infectionsByRequestedTime * compute) / day);
  }

  return {
    data,
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
      currentlyInfected: severeCurrentlyInfected,
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
