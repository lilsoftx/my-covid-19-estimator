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

  const impact = {};
  const severeImpact = {};

  // chanllenge 1
  impact.currentlyInfected = Math.trunc(reportedCases * 10);
  severeImpact.currentlyInfected = Matg.trunc(reportedCases * 50);

  // check the timeToElapse in days weeks or months
  let getFactor;

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

  // time passed as infection grows
  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** getFactor);
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** getFactor);

  // challenge 2
  const impactRequestedTime = impact.infectionsByRequestedTime * 0.15;
  const severeImpactRequest = severeImpact.infectionsByRequestedTime * 0.15;

  impact.severeCasesByRequestedTime = Math.trunc(impactRequestedTime);
  severeImpact.severeCasesByRequestedTime = Math.trunc(severeImpactRequest);

  const bedsAvailable = totalHospitalBeds * 0.35;
  const impactHospitalBedval = bedsAvailable - impactRequestedTime;
  const sevImpactHospitalBedval = bedsAvailable - severeImpactRequest;

  impact.hospitalBedsByRequestedTime = Math.trunc(impactHospitalBedval);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(sevImpactHospitalBedval);

  // challenge 3
  const impactCasesForICU = impact.infectionsByRequestedTime * 0.05;
  const sevImpactCasesForICU = severeImpact.infectionsByRequestedTime * 0.05;
  const impactVentilator = impact.infectionsByRequestedTime * 0.02;
  const sevImpactVentilator = severeImpact.infectionsByRequestedTime * 0.02;

  impact.casesForICUByRequestedTime = Math.trunc(impactCasesForICU);
  severeImpact.casesForICUByRequestedTime = Math.trunc(sevImpactCasesForICU);

  impact.casesForVentilatorsByRequestedTime = Math.trunc(impactVentilator);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(sevImpactVentilator);


  // money to be lost by economy
  let day;
  const compute = population * avgDailyIncomeInUSD;
  if (periodType === 'months') {
    day = timeToElapse * 30;

   impact.dollarsInFlight = (
     Math.trunc((impact.infectionsByRequestedTime * compute) / day)
   );
   severeImpact.dollarsInFlight = (
    Math.trunc((severeImpact.infectionsByRequestedTime * compute) / day)
   );
  } else if (periodType === 'weeks') {
    days = timeToElapse * 7;

    impact.dollarsInFlight = (
     Math.trunc((impact.infectionsByRequestedTime * compute) / day)
    );
   severeImpact.dollarsInFlight = (
    Math.trunc((severeImpact.infectionsByRequestedTime * compute) / day)
   );
  } else if (periodType === 'days') {
    impact.dollarsInFlight = (
      Math.trunc((impact.infectionsByRequestedTime * compute) / day)
    );
    severeImpact.dollarsInFlight = (
     Math.trunc((severeImpact.infectionsByRequestedTime * compute) / day)
    );
  }

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
