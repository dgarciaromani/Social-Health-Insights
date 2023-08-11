const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port,
  database: config.db
});
connection.connect((err) => err && console.log(err));


const get_ranks = async function(req, res) {
  let state = req.query.state ?? '';
  if (state === 'All States') {
    state = ''
  }
  const variable = req.query.variable ?? 'ACS_PCT_NO_WORK_NO_SCHL_16_19';

  connection.query(`
    WITH CTE AS (
    SELECT 
    TRACTFIPS,
    ${variable},
    PERCENT_RANK() over (ORDER BY ${variable}) as perc_rank
    FROM tract_sdoh
    WHERE STATE LIKE '%${state}%' 
    AND ${variable} IS NOT NULL)
    , CTE2 AS(
    SELECT 
      "bottom 5 percent" as id,
      avg(\`Stroke\`) as "Stroke",
      avg(\`All teeth lost among adults\`) as "All teeth lost among adults",
      avg(\`Arthritis\`) as "Arthritis",
      avg(\`Cancer (excluding skin cancer)\`) as "Cancer (excluding skin cancer)",
      avg(\`Chronic kidney disease\`) as "Chronic kidney disease",
      avg(\`Chronic obstructive pulmonary disease\`) as "Chronic obstructive pulmonary disease",
      avg(\`Coronary heart disease\`) as "Coronary heart disease",
      avg(\`Current asthma\`) as "Current asthma",
      avg(\`Depression\`) as "Depression",
      avg(\`Diagnosed diabetes\`) as "Diagnosed diabetes",
      avg(\`High blood pressure\`) as "High blood pressure",
      avg(\`High cholesterol\`) as "High cholesterol",
      avg(\`Obesity\`) as "Obesity"
    FROM CTE c
    JOIN tract_health_outcomes t
      ON c.TRACTFIPS = t.LocationName
    WHERE perc_rank < 0.05
    UNION
    SELECT 
      "top 5 percent" as id,
      avg(\`Stroke\`) as "Stroke",
      avg(\`All teeth lost among adults\`) as "All teeth lost among adults",
      avg(\`Arthritis\`) as "Arthritis",
      avg(\`Cancer (excluding skin cancer)\`) as "Cancer (excluding skin cancer)",
      avg(\`Chronic kidney disease\`) as "Chronic kidney disease",
      avg(\`Chronic obstructive pulmonary disease\`) as "Chronic obstructive pulmonary disease",
      avg(\`Coronary heart disease\`) as "Coronary heart disease",
      avg(\`Current asthma\`) as "Current asthma",
      avg(\`Depression\`) as "Depression",
      avg(\`Diagnosed diabetes\`) as "Diagnosed diabetes",
      avg(\`High blood pressure\`) as "High blood pressure",
      avg(\`High cholesterol\`) as "High cholesterol",
      avg(\`Obesity\`) as "Obesity"
    FROM CTE c
    JOIN tract_health_outcomes t
      ON c.TRACTFIPS = t.LocationName
    WHERE perc_rank > 0.95)
    , CTE3 AS (
      SELECT
      "All teeth lost among adults" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`All teeth lost among adults\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`All teeth lost among adults\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`All teeth lost among adults\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Arthritis" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Arthritis\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Arthritis\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Arthritis\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Cancer (excluding skin cancer)" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Cancer (excluding skin cancer)\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Cancer (excluding skin cancer)\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Cancer (excluding skin cancer)\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Chronic kidney disease" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Chronic kidney disease\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Chronic kidney disease\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Chronic kidney disease\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Chronic obstructive pulmonary disease" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Chronic obstructive pulmonary disease\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Chronic obstructive pulmonary disease\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Chronic obstructive pulmonary disease\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Coronary heart disease" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Coronary heart disease\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Coronary heart disease\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Coronary heart disease\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Current asthma" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Current asthma\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Current asthma\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Current asthma\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Depression" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Depression\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Depression\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Depression\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Diagnosed diabetes" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Diagnosed diabetes\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Diagnosed diabetes\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Diagnosed diabetes\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "High blood pressure" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`High blood pressure\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`High blood pressure\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`High blood pressure\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "High cholesterol" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`High cholesterol\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`High cholesterol\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`High cholesterol\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Obesity" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Obesity\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Obesity\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Obesity\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2
      UNION ALL
      SELECT
      "Stroke" AS "label",
      CASE WHEN id = "bottom 5 percent" THEN \`Stroke\` ELSE 0 END AS "bottom 5 percent",
      CASE WHEN id = "top 5 percent" THEN \`Stroke\` ELSE 0 END AS "top 5 percent",
      (SELECT MAX(\`Stroke\`) FROM tract_health_outcomes) as "fullMark"
      FROM CTE2)
      SELECT
      label,
      ROUND((MAX(\`bottom 5 percent\`)/MAX(fullMark))*100,2) as "bottom 5 percent",
      ROUND((MAX(\`top 5 percent\`)/MAX(fullMark))*100,2) as "top 5 percent",
      MAX(fullMark) as "fullMark"
      FROM CTE3
      GROUP BY label
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const get_address = async function(req, res) {

  const street = req.params.street;
  const city = req.params.city;
  const state = req.params.state;
  const zip = req.params.zip;

  fetch(`https://geocoding.geo.census.gov/geocoder/geographies/address?street=${street}&city=${city}&state=${state}&zip=${zip}&benchmark=2020&vintage=2020&layers=10&format=json`)  
    .then(res => res.json())
    .then(resJson => {
      if (resJson['result']['addressMatches'].length == 0){
        console.log("Unable to find address.")
        res.json(0);
      } else {
        let dic = resJson['result']['addressMatches'][0]['geographies']['Census Blocks'][0]
        let tract = dic['STATE'] + dic['COUNTY'] + dic['TRACT']
        connection.query(`
          SELECT 
            tract,
            coordinates
          FROM polygons
          WHERE tract like '${tract}'
        `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        });
      }
    })
}

const get_percentile_groups = async function(req, res) {
  
  const urlArray = req.url.split("/").slice(2) // urlArray[0] is the state, then anything after it is a parameter
  const state = urlArray[0]
  const arrayOfParams = urlArray.slice(1, urlArray.length-1) // last item in the array is blank, so we remove it here
  let whereString = ""
  let nullString = ""
  let percRankString = ""
  const groupDict = {
    "1": {"low": 0.0, "high": 0.2},
    "2": {"low": 0.2, "high": 0.4},
    "3": {"low": 0.4, "high": 0.6},
    "4": {"low": 0.6, "high": 0.8},
    "5": {"low": 0.8, "high": 1.1}
  }
  arrayOfParams.forEach((element, index) => {
    let internalArray = element.split("-")
    let rank_name = "rank_name" + index
    percRankString = percRankString + ` PERCENT_RANK() OVER (PARTITION BY STATE ORDER BY ${internalArray[0]} ASC) as ${rank_name},`
    nullString = nullString + ` AND ${internalArray[0]} IS NOT NULL `
    if (index == 0) {
      whereString = whereString + ` WHERE (${rank_name} >= ${groupDict[internalArray[1]]["low"]} AND ${rank_name} < ${groupDict[internalArray[1]]["high"]}) `
    } else {
      whereString = whereString + ` AND (${rank_name} >= ${groupDict[internalArray[1]]["low"]} AND ${rank_name} < ${groupDict[internalArray[1]]["high"]}) `
    }
  })
  percRankString = percRankString.slice(0, -1) // remove the last comma from the list of ranks

  connection.query(`
    WITH CTE AS (
      SELECT
        *,
        ${percRankString}
      FROM tract_sdoh s
      JOIN polygons p
        ON s.TRACTFIPS = p.tract
      WHERE STATE LIKE '${state}'
      ${nullString}
    )
    SELECT * FROM CTE
    ${whereString};
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  })

}

const slider_search = async function (req, res) {

  const urlArray = req.url.split("/").slice(2) // urlArray[0] is the state, then anything after it is a parameter
  const state = urlArray[0]
  const arrayOfParams = urlArray.slice(1, urlArray.length-1) // last item in the array is blank, so we remove it here
  let string = ""
  arrayOfParams.forEach(element => {
    let internalArray = element.split("-")
    string = string + ` AND ${internalArray[0]} BETWEEN ${internalArray[1]} AND ${internalArray[2]} `
  });

  connection.query(`
    SELECT
      *
    FROM tract_sdoh s
    JOIN polygons p
      ON s.TRACTFIPS = p.tract
    WHERE s.STATE LIKE '${state}'
    ${string}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  })
}

const get_states = async function (req, res) {
  const healthOutcome = req.params.healthOutcome;
  const temp = healthOutcome.replace(/%20/g, " ");
  const healthOutcomeFixed = '`' + temp + '`'
  const avgPrevalence = req.params.avgPrevalence;
  const percentage = req.params.percentage;
  const percentageFixed = percentage / 100;
  const moreLess = req.params.moreLess;
  const aboveBelow = req.params.aboveBelow;

  connection.query(`
    WITH CTE AS (
      SELECT
          STATE,
          COUNTY,
          AVG(${healthOutcomeFixed}) as avg_healthoutcome
      FROM tract_health_outcomes t
      JOIN tract_sdoh s
        ON t.LocationName = s.TRACTFIPS
      GROUP BY STATE, COUNTY)
      , CTE2 AS (
      SELECT
        STATE,
          SUM(CASE WHEN avg_healthoutcome ${moreLess} ${avgPrevalence} THEN 1 ELSE 0 END) as num,
          COUNT(COUNTY) as total_counties,
          SUM(CASE WHEN avg_healthoutcome ${moreLess} ${avgPrevalence} THEN 1 ELSE 0 END) / COUNT(COUNTY) as pct
      FROM CTE
      GROUP BY STATE)
      SELECT
        STATE
      FROM CTE2
      WHERE pct ${aboveBelow} ${percentageFixed}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  })
}

const tract_search = async function (req, res) {
  const tract = req.params.tract;

  connection.query(`
  WITH CTE1 AS
    (SELECT STATE, COUNTY, TRACTFIPS,
        ACS_PCT_NO_WORK_NO_SCHL_16_19,
        ACS_PCT_COLLEGE_ASSOCIATE_DGR,
        ACS_PCT_BACHELOR_DGR,
        ACS_PCT_GRADUATE_DGR,
        ACS_PCT_HS_GRADUATE,
        ACS_PCT_LT_HS,
        ACS_PCT_POSTHS_ED,
        POS_DIST_PED_ICU_TRACT,
        POS_DIST_ED_TRACT,
        POS_DIST_OBSTETRICS_TRACT,
        POS_DIST_CLINIC_TRACT,
        HIFLD_DIST_UC_TRACT,
        ACS_PCT_MEDICAID_ANY,
        ACS_PCT_UNINSURED,
        ACS_MEDIAN_RENT,
        ACS_MEDIAN_HOME_VALUE,
        ACS_PCT_OWNER_HU_COST_50PCT,
        ACS_PCT_OWNER_HU_CHILD,
        ACS_MEDIAN_YEAR_BUILT,
        ACS_PCT_RENTER_HU_COST_50PCT,
        ACS_PCT_1UP_PERS_1ROOM,
        ACS_PCT_VACANT_HU,
        ACS_TOT_HU,
        ACS_MEDIAN_INC_F,
        ACS_MEDIAN_INC_M,
        ACS_MEDIAN_HH_INC,
        ACS_PCT_INC50_BELOW17,
        ACS_GINI_INDEX,
        ACS_PER_CAPITA_INC,
        ACS_PCT_CHILD_1FAM,
        ACS_PCT_CHILDREN_GRANDPARENT,
        ACS_PCT_HH_KID_1PRNT,
        ACS_PCT_HH_1PERS,
        ACS_PCT_HH_ABOVE65,
        ACS_PCT_HH_ALONE_ABOVE65,
        ACS_TOT_GRANDCHILDREN_GP,
        ACS_PCT_WORK_NO_CAR
    FROM tract_sdoh
    WHERE TRACTFIPS = '${tract}'),
  CTE2 AS
    (SELECT CTE1.STATE AS STATE, -- tract_sdoh.TRACTFIPS AS TRACTFIPS,
        ROUND(AVG(t.ACS_PCT_NO_WORK_NO_SCHL_16_19), 2) AS ACS_PCT_NO_WORK_NO_SCHL_16_19,
        ROUND(AVG(t.ACS_PCT_COLLEGE_ASSOCIATE_DGR), 2) AS ACS_PCT_COLLEGE_ASSOCIATE_DGR,
        ROUND(AVG(t.ACS_PCT_BACHELOR_DGR), 2) AS ACS_PCT_BACHELOR_DGR,
        ROUND(AVG(t.ACS_PCT_GRADUATE_DGR), 2) AS ACS_PCT_GRADUATE_DGR,
        ROUND(AVG(t.ACS_PCT_HS_GRADUATE), 2) AS ACS_PCT_HS_GRADUATE,
        ROUND(AVG(t.ACS_PCT_LT_HS), 2) AS ACS_PCT_LT_HS,
        ROUND(AVG(t.ACS_PCT_POSTHS_ED), 2) AS ACS_PCT_POSTHS_ED,
        ROUND(AVG(t.POS_DIST_PED_ICU_TRACT), 2) AS POS_DIST_PED_ICU_TRACT,
        ROUND(AVG(t.POS_DIST_ED_TRACT), 2) AS POS_DIST_ED_TRACT,
        ROUND(AVG(t.POS_DIST_OBSTETRICS_TRACT), 2) AS POS_DIST_OBSTETRICS_TRACT,
        ROUND(AVG(t.POS_DIST_CLINIC_TRACT), 2) AS POS_DIST_CLINIC_TRACT,
        ROUND(AVG(t.HIFLD_DIST_UC_TRACT), 2) AS HIFLD_DIST_UC_TRACT,
        ROUND(AVG(t.ACS_PCT_MEDICAID_ANY), 2) AS ACS_PCT_MEDICAID_ANY,
        ROUND(AVG(t.ACS_PCT_UNINSURED), 2) AS ACS_PCT_UNINSURED,
        ROUND(AVG(t.ACS_MEDIAN_RENT)) AS ACS_MEDIAN_RENT,
        ROUND(AVG(t.ACS_MEDIAN_HOME_VALUE)) AS ACS_MEDIAN_HOME_VALUE,
        ROUND(AVG(t.ACS_PCT_OWNER_HU_COST_50PCT), 2) AS ACS_PCT_OWNER_HU_COST_50PCT,
        ROUND(AVG(t.ACS_PCT_OWNER_HU_CHILD), 2) AS ACS_PCT_OWNER_HU_CHILD,
        ROUND(AVG(t.ACS_MEDIAN_YEAR_BUILT)) AS ACS_MEDIAN_YEAR_BUILT,
        ROUND(AVG(t.ACS_PCT_RENTER_HU_COST_50PCT), 2) AS ACS_PCT_RENTER_HU_COST_50PCT,
        ROUND(AVG(t.ACS_PCT_1UP_PERS_1ROOM), 2) AS ACS_PCT_1UP_PERS_1ROOM,
        ROUND(AVG(t.ACS_PCT_VACANT_HU), 2) AS ACS_PCT_VACANT_HU,
        ROUND(AVG(t.ACS_TOT_HU)) AS ACS_TOT_HU,
        ROUND(AVG(t.ACS_MEDIAN_INC_F)) AS ACS_MEDIAN_INC_F,
        ROUND(AVG(t.ACS_MEDIAN_INC_M)) AS ACS_MEDIAN_INC_M,
        ROUND(AVG(t.ACS_MEDIAN_HH_INC)) AS ACS_MEDIAN_HH_INC,
        ROUND(AVG(t.ACS_PCT_INC50_BELOW17), 2) AS ACS_PCT_INC50_BELOW17,
        ROUND(AVG(t.ACS_GINI_INDEX), 2) AS ACS_GINI_INDEX,
        ROUND(AVG(t.ACS_PER_CAPITA_INC)) AS ACS_PER_CAPITA_INC,
        ROUND(AVG(t.ACS_PCT_CHILD_1FAM), 2) AS ACS_PCT_CHILD_1FAM,
        ROUND(AVG(t.ACS_PCT_CHILDREN_GRANDPARENT), 2) AS ACS_PCT_CHILDREN_GRANDPARENT,
        ROUND(AVG(t.ACS_PCT_HH_KID_1PRNT), 2) AS ACS_PCT_HH_KID_1PRNT,
        ROUND(AVG(t.ACS_PCT_HH_1PERS), 2) AS ACS_PCT_HH_1PERS,
        ROUND(AVG(t.ACS_PCT_HH_ABOVE65), 2) AS ACS_PCT_HH_ABOVE65,
        ROUND(AVG(t.ACS_PCT_HH_ALONE_ABOVE65), 2) AS ACS_PCT_HH_ALONE_ABOVE65,
        ROUND(AVG(t.ACS_TOT_GRANDCHILDREN_GP), 2) AS ACS_TOT_GRANDCHILDREN_GP,
        ROUND(AVG(t.ACS_PCT_WORK_NO_CAR), 2) AS ACS_PCT_WORK_NO_CAR
    FROM tract_sdoh t
        JOIN CTE1 ON t.STATE = CTE1.STATE
    GROUP BY STATE),

  CTE3 AS
  (SELECT CTE1.STATE AS STATE, CTE1.COUNTY AS COUNTY,
        ROUND(AVG(t.ACS_PCT_NO_WORK_NO_SCHL_16_19), 2) AS ACS_PCT_NO_WORK_NO_SCHL_16_19,
        ROUND(AVG(t.ACS_PCT_COLLEGE_ASSOCIATE_DGR), 2) AS ACS_PCT_COLLEGE_ASSOCIATE_DGR,
        ROUND(AVG(t.ACS_PCT_BACHELOR_DGR), 2) AS ACS_PCT_BACHELOR_DGR,
        ROUND(AVG(t.ACS_PCT_GRADUATE_DGR), 2) AS ACS_PCT_GRADUATE_DGR,
        ROUND(AVG(t.ACS_PCT_HS_GRADUATE), 2) AS ACS_PCT_HS_GRADUATE,
        ROUND(AVG(t.ACS_PCT_LT_HS), 2) AS ACS_PCT_LT_HS,
        ROUND(AVG(t.ACS_PCT_POSTHS_ED), 2) AS ACS_PCT_POSTHS_ED,
        ROUND(AVG(t.POS_DIST_PED_ICU_TRACT), 2) AS POS_DIST_PED_ICU_TRACT,
        ROUND(AVG(t.POS_DIST_ED_TRACT), 2) AS POS_DIST_ED_TRACT,
        ROUND(AVG(t.POS_DIST_OBSTETRICS_TRACT), 2) AS POS_DIST_OBSTETRICS_TRACT,
        ROUND(AVG(t.POS_DIST_CLINIC_TRACT), 2) AS POS_DIST_CLINIC_TRACT,
        ROUND(AVG(t.HIFLD_DIST_UC_TRACT), 2) AS HIFLD_DIST_UC_TRACT,
        ROUND(AVG(t.ACS_PCT_MEDICAID_ANY), 2) AS ACS_PCT_MEDICAID_ANY,
        ROUND(AVG(t.ACS_PCT_UNINSURED), 2) AS ACS_PCT_UNINSURED,
        ROUND(AVG(t.ACS_MEDIAN_RENT)) AS ACS_MEDIAN_RENT,
        ROUND(AVG(t.ACS_MEDIAN_HOME_VALUE)) AS ACS_MEDIAN_HOME_VALUE,
        ROUND(AVG(t.ACS_PCT_OWNER_HU_COST_50PCT), 2) AS ACS_PCT_OWNER_HU_COST_50PCT,
        ROUND(AVG(t.ACS_PCT_OWNER_HU_CHILD), 2) AS ACS_PCT_OWNER_HU_CHILD,
        ROUND(AVG(t.ACS_MEDIAN_YEAR_BUILT)) AS ACS_MEDIAN_YEAR_BUILT,
        ROUND(AVG(t.ACS_PCT_RENTER_HU_COST_50PCT), 2) AS ACS_PCT_RENTER_HU_COST_50PCT,
        ROUND(AVG(t.ACS_PCT_1UP_PERS_1ROOM), 2) AS ACS_PCT_1UP_PERS_1ROOM,
        ROUND(AVG(t.ACS_PCT_VACANT_HU), 2) AS ACS_PCT_VACANT_HU,
        ROUND(AVG(t.ACS_TOT_HU)) AS ACS_TOT_HU,
        ROUND(AVG(t.ACS_MEDIAN_INC_F)) AS ACS_MEDIAN_INC_F,
        ROUND(AVG(t.ACS_MEDIAN_INC_M)) AS ACS_MEDIAN_INC_M,
        ROUND(AVG(t.ACS_MEDIAN_HH_INC)) AS ACS_MEDIAN_HH_INC,
        ROUND(AVG(t.ACS_PCT_INC50_BELOW17), 2) AS ACS_PCT_INC50_BELOW17,
        ROUND(AVG(t.ACS_GINI_INDEX), 2) AS ACS_GINI_INDEX,
        ROUND(AVG(t.ACS_PER_CAPITA_INC)) AS ACS_PER_CAPITA_INC,
        ROUND(AVG(t.ACS_PCT_CHILD_1FAM), 2) AS ACS_PCT_CHILD_1FAM,
        ROUND(AVG(t.ACS_PCT_CHILDREN_GRANDPARENT), 2) AS ACS_PCT_CHILDREN_GRANDPARENT,
        ROUND(AVG(t.ACS_PCT_HH_KID_1PRNT), 2) AS ACS_PCT_HH_KID_1PRNT,
        ROUND(AVG(t.ACS_PCT_HH_1PERS), 2) AS ACS_PCT_HH_1PERS,
        ROUND(AVG(t.ACS_PCT_HH_ABOVE65), 2) AS ACS_PCT_HH_ABOVE65,
        ROUND(AVG(t.ACS_PCT_HH_ALONE_ABOVE65), 2) AS ACS_PCT_HH_ALONE_ABOVE65,
        ROUND(AVG(t.ACS_TOT_GRANDCHILDREN_GP), 2) AS ACS_TOT_GRANDCHILDREN_GP,
        ROUND(AVG(t.ACS_PCT_WORK_NO_CAR), 2) AS ACS_PCT_WORK_NO_CAR
    FROM tract_sdoh t
        JOIN CTE1 ON t.COUNTY = CTE1.COUNTY
    GROUP BY STATE, COUNTY),
  CTE4 AS
    (SELECT CTE1.STATE AS STATE, t.TRACTFIPS
    FROM tract_sdoh t
        JOIN CTE1 ON t.STATE = CTE1.STATE),
  CTE5 AS
    (SELECT *
    FROM tract_sdoh t LEFT JOIN tract_health_outcomes th ON t.TRACTFIPS = th.LocationName
    WHERE t.TRACTFIPS IN
        (SELECT TRACTFIPS FROM CTE4)),
  CTE6 AS
    (SELECT CTE1.STATE AS STATE, CTE1.COUNTY AS COUNTY, t.TRACTFIPS
    FROM tract_sdoh t JOIN CTE1 ON t.COUNTY = CTE1.COUNTY),
  CTE7 AS
    (SELECT STATE, COUNTY,
      \`All teeth lost among adults\`,
      \`Arthritis\`,
      \`Cancer (excluding skin cancer)\`,
      \`Chronic kidney disease\`,
      \`Chronic obstructive pulmonary disease\`,
      \`Coronary heart disease\`,
      \`Current asthma\`,
      \`Depression\`,
      \`Diagnosed diabetes\`,
      \`High blood pressure\`,
      \`High cholesterol\`,
      \`Obesity\`,
      \`Stroke\`
    FROM CTE5
    WHERE LocationName = '${tract}'),
  CTE8 AS
    (SELECT CTE5.STATE AS STATE,
        ROUND(AVG(\`All teeth lost among adults\`), 2) AS \`All teeth lost among adults\`,
        ROUND(AVG(\`Arthritis\`), 2) AS \`Arthritis\`,
        ROUND(AVG(\`Cancer (excluding skin cancer)\`), 2) AS \`Cancer (excluding skin cancer)\`,
        ROUND(AVG(\`Chronic kidney disease\`), 2) AS \`Chronic kidney disease\`,
        ROUND(AVG(\`Chronic obstructive pulmonary disease\`), 2) AS \`Chronic obstructive pulmonary disease\`,
        ROUND(AVG(\`Coronary heart disease\`), 2) AS \`Coronary heart disease\`,
        ROUND(AVG(\`Current asthma\`), 2) AS \`Current asthma\`,
        ROUND(AVG(\`Depression\`), 2) AS \`Depression\`,
        ROUND(AVG(\`Diagnosed diabetes\`), 2) AS \`Diagnosed diabetes\`,
        ROUND(AVG(\`High blood pressure\`), 2) AS \`High blood pressure\`,
        ROUND(AVG(\`High cholesterol\`), 2) AS \`High cholesterol\`,
        ROUND(AVG(\`Obesity\`), 2) AS \`Obesity\`,
        ROUND(AVG(\`Stroke\`), 2) AS \`Stroke\`
    FROM CTE5
    GROUP BY STATE),
  CTE9 AS
    (SELECT CTE1.COUNTY AS COUNTY,
        ROUND(AVG(\`All teeth lost among adults\`), 2) AS \`All teeth lost among adults\`,
        ROUND(AVG(\`Arthritis\`), 2) AS \`Arthritis\`,
        ROUND(AVG(\`Cancer (excluding skin cancer)\`), 2) AS \`Cancer (excluding skin cancer)\`,
        ROUND(AVG(\`Chronic kidney disease\`), 2) AS \`Chronic kidney disease\`,
        ROUND(AVG(\`Chronic obstructive pulmonary disease\`), 2) AS \`Chronic obstructive pulmonary disease\`,
        ROUND(AVG(\`Coronary heart disease\`), 2) AS \`Coronary heart disease\`,
        ROUND(AVG(\`Current asthma\`), 2) AS \`Current asthma\`,
        ROUND(AVG(\`Depression\`), 2) AS \`Depression\`,
        ROUND(AVG(\`Diagnosed diabetes\`), 2) AS \`Diagnosed diabetes\`,
        ROUND(AVG(\`High blood pressure\`), 2) AS \`High blood pressure\`,
        ROUND(AVG(\`High cholesterol\`), 2) AS \`High cholesterol\`,
        ROUND(AVG(\`Obesity\`), 2) AS \`Obesity\`,
        ROUND(AVG(\`Stroke\`), 2) AS \`Stroke\`
    FROM CTE5
        JOIN CTE1 ON CTE5.COUNTY = CTE1.COUNTY
    WHERE CTE5.COUNTY = CTE1.COUNTY
    GROUP BY CTE5.COUNTY)
  SELECT "ACS_PCT_NO_WORK_NO_SCHL_16_19" AS "Variable", "SDoH" AS "Category", "Education" AS "Domain", CTE1.ACS_PCT_NO_WORK_NO_SCHL_16_19 AS "Tract Value", CTE3.ACS_PCT_NO_WORK_NO_SCHL_16_19 AS "County Average", CTE2.ACS_PCT_NO_WORK_NO_SCHL_16_19 AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
    JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_COLLEGE_ASSOCIATE_DGR" AS "Variable", "SDoH" AS "Category", "Education" AS "Domain", CTE1.ACS_PCT_COLLEGE_ASSOCIATE_DGR AS "Tract Value", CTE3.ACS_PCT_COLLEGE_ASSOCIATE_DGR AS "County Average", CTE2.ACS_PCT_COLLEGE_ASSOCIATE_DGR AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_BACHELOR_DGR" AS "Variable", "SDoH" AS "Category", "Education" AS "Domain", CTE1.ACS_PCT_BACHELOR_DGR AS "Tract Value", CTE3.ACS_PCT_BACHELOR_DGR AS "County Average", CTE2.ACS_PCT_BACHELOR_DGR AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_GRADUATE_DGR" AS "Variable", "SDoH" AS "Category", "Education" AS "Domain", CTE1.ACS_PCT_GRADUATE_DGR AS "Tract Value", CTE3.ACS_PCT_GRADUATE_DGR AS "County Average", CTE2.ACS_PCT_GRADUATE_DGR AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_HS_GRADUATE" AS "Variable", "SDoH" AS "Category", "Education" AS "Domain", CTE1.ACS_PCT_HS_GRADUATE AS "Tract Value", CTE3.ACS_PCT_HS_GRADUATE AS "County Average", CTE2.ACS_PCT_HS_GRADUATE AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_LT_HS" AS "Variable", "SDoH" AS "Category", "Education" AS "Domain", CTE1.ACS_PCT_LT_HS AS "Tract Value", CTE3.ACS_PCT_LT_HS AS "County Average", CTE2.ACS_PCT_LT_HS AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_POSTHS_ED" AS "Variable", "SDoH" AS "Category", "Education" AS "Domain", CTE1.ACS_PCT_POSTHS_ED AS "Tract Value", CTE3.ACS_PCT_POSTHS_ED AS "County Average", CTE2.ACS_PCT_POSTHS_ED AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "POS_DIST_PED_ICU_TRACT" AS "Variable", "SDoH" AS "Category", "Healthcare context" AS "Domain", CTE1.POS_DIST_PED_ICU_TRACT AS "Tract Value", CTE3.POS_DIST_PED_ICU_TRACT AS "County Average", CTE2.POS_DIST_PED_ICU_TRACT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "POS_DIST_ED_TRACT" AS "Variable", "SDoH" AS "Category", "Healthcare context" AS "Domain", CTE1.POS_DIST_ED_TRACT AS "Tract Value", CTE3.POS_DIST_ED_TRACT AS "County Average", CTE2.POS_DIST_ED_TRACT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "POS_DIST_OBSTETRICS_TRACT" AS "Variable", "SDoH" AS "Category", "Healthcare context" AS "Domain", CTE1.POS_DIST_OBSTETRICS_TRACT AS "Tract Value", CTE3.POS_DIST_OBSTETRICS_TRACT AS "County Average", CTE2.POS_DIST_OBSTETRICS_TRACT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "POS_DIST_CLINIC_TRACT" AS "Variable", "SDoH" AS "Category", "Healthcare context" AS "Domain", CTE1.POS_DIST_CLINIC_TRACT AS "Tract Value", CTE3.POS_DIST_CLINIC_TRACT AS "County Average", CTE2.POS_DIST_CLINIC_TRACT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "HIFLD_DIST_UC_TRACT" AS "Variable", "SDoH" AS "Category", "Healthcare context" AS "Domain", CTE1.HIFLD_DIST_UC_TRACT AS "Tract Value", CTE3.HIFLD_DIST_UC_TRACT AS "County Average", CTE2.HIFLD_DIST_UC_TRACT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_MEDICAID_ANY" AS "Variable", "SDoH" AS "Category", "Healthcare context" AS "Domain", CTE1.ACS_PCT_MEDICAID_ANY AS "Tract Value", CTE3.ACS_PCT_MEDICAID_ANY AS "County Average", CTE2.ACS_PCT_MEDICAID_ANY AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_UNINSURED" AS "Variable", "SDoH" AS "Category", "Healthcare context" AS "Domain", CTE1.ACS_PCT_UNINSURED AS "Tract Value", CTE3.ACS_PCT_UNINSURED AS "County Average", CTE2.ACS_PCT_UNINSURED AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_MEDIAN_RENT" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_MEDIAN_RENT AS "Tract Value", CTE3.ACS_MEDIAN_RENT AS "County Average", CTE2.ACS_MEDIAN_RENT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_MEDIAN_HOME_VALUE" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_MEDIAN_HOME_VALUE AS "Tract Value", CTE3.ACS_MEDIAN_HOME_VALUE AS "County Average", CTE2.ACS_MEDIAN_HOME_VALUE AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_OWNER_HU_COST_50PCT" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_PCT_OWNER_HU_COST_50PCT AS "Tract Value", CTE3.ACS_PCT_OWNER_HU_COST_50PCT AS "County Average", CTE2.ACS_PCT_OWNER_HU_COST_50PCT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_OWNER_HU_CHILD" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_PCT_OWNER_HU_CHILD AS "Tract Value", CTE3.ACS_PCT_OWNER_HU_CHILD AS "County Average", CTE2.ACS_PCT_OWNER_HU_CHILD AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_MEDIAN_YEAR_BUILT" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_MEDIAN_YEAR_BUILT AS "Tract Value", CTE3.ACS_MEDIAN_YEAR_BUILT AS "County Average", CTE2.ACS_MEDIAN_YEAR_BUILT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_RENTER_HU_COST_50PCT" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_PCT_RENTER_HU_COST_50PCT AS "Tract Value", CTE3.ACS_PCT_RENTER_HU_COST_50PCT AS "County Average", CTE2.ACS_PCT_RENTER_HU_COST_50PCT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_1UP_PERS_1ROOM" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_PCT_1UP_PERS_1ROOM AS "Tract Value", CTE3.ACS_PCT_1UP_PERS_1ROOM AS "County Average", CTE2.ACS_PCT_1UP_PERS_1ROOM AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_VACANT_HU" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_PCT_VACANT_HU AS "Tract Value", CTE3.ACS_PCT_VACANT_HU AS "County Average", CTE2.ACS_PCT_VACANT_HU AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_TOT_HU" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_TOT_HU AS "Tract Value", CTE3.ACS_TOT_HU AS "County Average", CTE2.ACS_TOT_HU AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_MEDIAN_INC_F" AS "Variable", "SDoH" AS "Category", "Economic Context" AS "Domain", CTE1.ACS_MEDIAN_INC_F AS "Tract Value", CTE3.ACS_MEDIAN_INC_F AS "County Average", CTE2.ACS_MEDIAN_INC_F AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_MEDIAN_INC_M" AS "Variable", "SDoH" AS "Category", "Economic Context" AS "Domain", CTE1.ACS_MEDIAN_INC_M AS "Tract Value", CTE3.ACS_MEDIAN_INC_M AS "County Average", CTE2.ACS_MEDIAN_INC_M AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_MEDIAN_HH_INC" AS "Variable", "SDoH" AS "Category", "Economic Context" AS "Domain", CTE1.ACS_MEDIAN_HH_INC AS "Tract Value", CTE3.ACS_MEDIAN_HH_INC AS "County Average", CTE2.ACS_MEDIAN_HH_INC AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_INC50_BELOW17" AS "Variable", "SDoH" AS "Category", "Economic Context" AS "Domain", CTE1.ACS_PCT_INC50_BELOW17 AS "Tract Value", CTE3.ACS_PCT_INC50_BELOW17 AS "County Average", CTE2.ACS_PCT_INC50_BELOW17 AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_GINI_INDEX" AS "Variable", "SDoH" AS "Category", "Economic Context" AS "Domain", CTE1.ACS_GINI_INDEX AS "Tract Value", CTE3.ACS_GINI_INDEX AS "County Average", CTE2.ACS_GINI_INDEX AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PER_CAPITA_INC" AS "Variable", "SDoH" AS "Category", "Economic Context" AS "Domain", CTE1.ACS_PER_CAPITA_INC AS "Tract Value", CTE3.ACS_PER_CAPITA_INC AS "County Average", CTE2.ACS_PER_CAPITA_INC AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_CHILD_1FAM" AS "Variable", "SDoH" AS "Category", "Social Context" AS "Domain", CTE1.ACS_PCT_CHILD_1FAM AS "Tract Value", CTE3.ACS_PCT_CHILD_1FAM AS "County Average", CTE2.ACS_PCT_CHILD_1FAM AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_CHILDREN_GRANDPARENT" AS "Variable", "SDoH" AS "Category", "Social Context" AS "Domain", CTE1.ACS_PCT_CHILDREN_GRANDPARENT AS "Tract Value", CTE3.ACS_PCT_CHILDREN_GRANDPARENT AS "County Average", CTE2.ACS_PCT_CHILDREN_GRANDPARENT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_HH_KID_1PRNT" AS "Variable", "SDoH" AS "Category", "Social Context" AS "Domain", CTE1.ACS_PCT_HH_KID_1PRNT AS "Tract Value", CTE3.ACS_PCT_HH_KID_1PRNT AS "County Average", CTE2.ACS_PCT_HH_KID_1PRNT AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_HH_1PERS" AS "Variable", "SDoH" AS "Category", "Social Context" AS "Domain", CTE1.ACS_PCT_HH_1PERS AS "Tract Value", CTE3.ACS_PCT_HH_1PERS AS "County Average", CTE2.ACS_PCT_HH_1PERS AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_HH_ABOVE65" AS "Variable", "SDoH" AS "Category", "Social Context" AS "Domain", CTE1.ACS_PCT_HH_ABOVE65 AS "Tract Value", CTE3.ACS_PCT_HH_ABOVE65 AS "County Average", CTE2.ACS_PCT_HH_ABOVE65 AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_HH_ALONE_ABOVE65" AS "Variable", "SDoH" AS "Category", "Social Context" AS "Domain", CTE1.ACS_PCT_HH_ALONE_ABOVE65 AS "Tract Value", CTE3.ACS_PCT_HH_ALONE_ABOVE65 AS "County Average", CTE2.ACS_PCT_HH_ALONE_ABOVE65 AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_TOT_GRANDCHILDREN_GP" AS "Variable", "SDoH" AS "Category", "Social Context" AS "Domain", CTE1.ACS_TOT_GRANDCHILDREN_GP AS "Tract Value", CTE3.ACS_TOT_GRANDCHILDREN_GP AS "County Average", CTE2.ACS_TOT_GRANDCHILDREN_GP AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "ACS_PCT_WORK_NO_CAR" AS "Variable", "SDoH" AS "Category", "Physical Infrastructure" AS "Domain", CTE1.ACS_PCT_WORK_NO_CAR AS "Tract Value", CTE3.ACS_PCT_WORK_NO_CAR AS "County Average", CTE2.ACS_PCT_WORK_NO_CAR AS "State Average"
  FROM CTE1 JOIN CTE2 ON CTE1.STATE = CTE2.STATE
  JOIN CTE3 ON CTE1.COUNTY = CTE3.COUNTY
  UNION ALL
  SELECT "All teeth lost among adults" AS "Variable", "Health Outcomes" AS "Category", "Health Condition" AS "Domain", CTE7.\`All teeth lost among adults\` AS "Tract Value", CTE9.\`All teeth lost among adults\` AS "County Average", CTE8.\`All teeth lost among adults\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Arthritis" AS "Variable", "Health Outcomes" AS "Category", "Disease" AS "Domain", CTE7.\`Arthritis\` AS "Tract Value", CTE9.\`Arthritis\` AS "County Average", CTE8.\`Arthritis\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Cancer (excluding skin cancer)" AS "Variable", "Health Outcomes" AS "Category", "Disease" AS "Domain", CTE7.\`Cancer (excluding skin cancer)\` AS "Tract Value", CTE9.\`Cancer (excluding skin cancer)\` AS "County Average", CTE8.\`Cancer (excluding skin cancer)\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Chronic kidney disease" AS "Variable", "Health Outcomes" AS "Category", "Disease" AS "Domain", CTE7.\`Chronic kidney disease\` AS "Tract Value", CTE9.\`Chronic kidney disease\` AS "County Average", CTE8.\`Chronic kidney disease\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Chronic obstructive pulmonary disease" AS "Variable", "Health Outcomes" AS "Category", "Disease" AS "Domain", CTE7.\`Chronic obstructive pulmonary disease\` AS "Tract Value", CTE9.\`Chronic obstructive pulmonary disease\` AS "County Average", CTE8.\`Chronic obstructive pulmonary disease\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Coronary heart disease" AS "Variable", "Health Outcomes" AS "Category", "Disease" AS "Domain", CTE7.\`Coronary heart disease\` AS "Tract Value", CTE9.\`Coronary heart disease\` AS "County Average", CTE8.\`Coronary heart disease\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Current asthma" AS "Variable", "Health Outcomes" AS "Category", "Disease" AS "Domain", CTE7.\`Current asthma\` AS "Tract Value", CTE9.\`Current asthma\` AS "County Average", CTE8.\`Current asthma\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Depression" AS "Variable", "Health Outcomes" AS "Category", "Mental Health Condition" AS "Domain", CTE7.\`Depression\` AS "Tract Value", CTE9.\`Depression\` AS "County Average", CTE8.\`Depression\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Diagnosed diabetes" AS "Variable", "Health Outcomes" AS "Category", "Disease" AS "Domain", CTE7.\`Diagnosed diabetes\` AS "Tract Value", CTE9.\`Diagnosed diabetes\` AS "County Average", CTE8.\`Diagnosed diabetes\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "High blood pressure" AS "Variable", "Health Outcomes" AS "Category", "Health Condition" AS "Domain", CTE7.\`High blood pressure\` AS "Tract Value", CTE9.\`High blood pressure\` AS "County Average", CTE8.\`High blood pressure\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "High cholesterol" AS "Variable", "Health Outcomes" AS "Category", "Health Condition" AS "Domain", CTE7.\`High cholesterol\` AS "Tract Value", CTE9.\`High cholesterol\` AS "County Average", CTE8.\`High cholesterol\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Obesity" AS "Variable", "Health Outcomes" AS "Category", "Health Condition" AS "Domain", CTE7.\`Obesity\` AS "Tract Value", CTE9.\`Obesity\` AS "County Average", CTE8.\`Obesity\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE
  JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY
  UNION ALL
  SELECT "Stroke" AS "Variable", "Health Outcomes" AS "Category", "Disease" AS "Domain", CTE7.\`Stroke\` AS "Tract Value", CTE9.\`Stroke\` AS "County Average", CTE8.\`Stroke\` AS "State Average"
  FROM CTE7 JOIN CTE8 ON CTE7.STATE = CTE8.STATE JOIN CTE9 ON CTE7.COUNTY = CTE9.COUNTY;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  })
}

module.exports = {
  get_ranks,
  get_address,
  slider_search,
  get_percentile_groups,
  get_states,
  tract_search
}
