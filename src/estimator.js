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

  // getting the time to elapse in days
  function getTimeToElapse() {
    if (input.periodType === 'days') {
      return input.timeToElapse;
    } 
    if (input.periodType === 'weeks') {
      return data.timeToElapse * 7;
    } 
    if (input.periodType === 'months') {
      const averageOfmonthsInAYear = 30;
      return Math.round(data.timeToElapse * averageOfmonthsInAYear);
    }
    return true;
  }

  // getting factor
  const getFactor = () => {
    const daysPerDoubleIncrease = 3;
    return getTimeToElapse() / daysPerDoubleIncrease;
  };

  // currently Infected cases for impact and severe impact
  const currentlyInfected = input.reportedCases * 10;
  const severeCurrentlyInfected = input.reportedCases * 50;

  // infections by requested time for impact and severe impact
  const infectionsByRequestedTime = currentlyInfected * (2 ** getFactor(input));
  const severeInfectionsByRequestedTime = severeCurrentlyInfected * (2 ** getFactor(input));

  // severe cases by requested time for impact and severe impact
  const severeCasesByRequestedTime = infectionsByRequestedTime * 0.15;
  const severeSevereCasesByRequestedTime = severeInfectionsByRequestedTime * 0.15;

  // hospital beds by requested time for impact and severe impact
  const AvailableBeds = input.totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = AvailableBeds - severeCasesByRequestedTime;
  const severeHospitalBedsByRequestedTime = AvailableBeds - severeSevereCasesByRequestedTime;

  // cases of ICU for impact and severe impact
  const casesForICUByRequestedTime = infectionsByRequestedTime * 0.5;
  const severeCasesForICUByRequestedTime = severeInfectionsByRequestedTime * 0.5;

  // cases that requires ventilation
  const casesForVentilatorsByRequestedTime = infectionsByRequestedTime * 0.2;
  const severeCasesForVentilatorsByRequestedTime = severeInfectionsByRequestedTime * 0.2;

  // money to be lost by economy
  const dollarInFlight = infectionsByRequestedTime * input.region.avgDailyIncomeInUSD * getTimeToElapse(input);
  const severeDollarInFlight = severeInfectionsByRequestedTime * input.region.avgDailyIncomeInUSD * getTimeToElapse(input);

  return {
    data: input,
    impact: {
      currentlyInfected: currentlyInfected,
      infectionsByRequestedTime: infectionsByRequestedTime.toString().split('.')[0],
      severeCasesByRequestedTime: severeCasesByRequestedTime.toString().split('.')[0],
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTime.toString().split('.')[0],
      casesForICUByRequestedTime: casesForICUByRequestedTime.toString().split('.')[0],
      casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTime.toString().split('.')[0],
      dollarInFlight: dollarInFlight.toFixed(2)
    },
    severeImpact: {
      currentlyInfected: severeCurrentlyInfected,
      infectionsByRequestedTime: severeInfectionsByRequestedTime.toString().split('.')[0],
      severeCasesByRequestedTime: severeSevereCasesByRequestedTime.toString().split('.')[0],
      hospitalBedsByRequestedTime: severeHospitalBedsByRequestedTime.toString().split('.')[0],
      casesForICUByRequestedTime: severeCasesForICUByRequestedTime.toString().split('.')[0],
      casesForVentilatorsByRequestedTime: severeCasesForVentilatorsByRequestedTime.toString().split('.')[0],
      dollarInFlight: severeDollarInFlight.toFixed(2)
    }
  }
};

export default covid19ImpactEstimator;