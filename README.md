# Is your health dependent on where you live? A deep dive into Social Determinants of Health and Health Outcomes

## About this project
Social Determinants of Health encompass the conditions under which individuals are born, grow, live, work, and age, and the impact of these conditions on their overall health and well-being. These determinants include various factors such as income, education, employment, housing, and social support. Extensive research has consistently shown that social determinants of health significantly influence individuals' health outcomes, with those experiencing disadvantage in these areas being at a higher risk of poor health and chronic diseases. Understanding and addressing social determinants of health is crucial for improving population health overall and achieving health equity.

This project was collaboratively developed, aiming to synthesize this data into an easily accessible website. Our objective was to demonstrate the disparities in opportunities across different areas of the United States.

For this project, we selected two primary datasets: one focusing on Social Determinants of Health and the other on health outcomes. Both datasets were collected at the census tract level, which represents statistical subdivisions of a county and can be updated by local participants before each decennial census. Census tracts offer a smaller level of granularity compared to zip codes, enabling us to highlight significant differences even within relatively close geographical areas. We joined the data based on the census tract to establish correlations between Social Determinants of Health and health outcomes.

To build the project, we utilized MySQL as our SQL database. The front end was developed using React, while the back end was constructed with Nodejs. We incorporated the MUI JavaScript library, as well as Leaflet and Leaflet-react, which allowed us to visualize GeoJSON data on a map. These tools and technologies formed the foundation of our project, enabling us to present the information effectively and create meaningful visualizations.

Check out the prototype [HERE](https://www.figma.com/file/TYet21DTYSyqbJweqhPkjv/Health-Website?type=design&node-id=0%3A1&mode=design&t=xXR83KZRjkNfCMvg-1)

## Getting started
Set up your local development environment by following these steps:
1. Clone the project into local.
2. Install all the npm packages. Go into the project folder, cd into the **server** folder and type the following command to install all npm packages (do the same for the **client**):
```bash
npm install
```
3. Set up a local instance of MySQL 8, configure it with a username and password, and start the server. Create a new database called _"sdoh_db"_ and load [these SQL script files](https://drive.google.com/drive/folders/12pYgJjYe66WcObWskI8ykl3_7xLxkIgr?usp=sharing) into your local database. You should have the following schema: 
```
sdoh_db
   label_keys
   polygons
   tract_health_outcomes
   tract_sdoh
```

4. Create a new file named _"config.json"_ in the **server** folder and add the following information (replace the different fields with the information from your local instance of MySQL):
```
{
  "host": "localhost",
  "port": "3306",
  "user": "root",
  "password": "password",
  "db": "sdoh_db",
  "server_host": "localhost",
  "server_port": "8080"
}
```

5. Create a new file named _"config.json"_ in the **client/src** folder and add the following information (replace the different fields with your own information if necessary):
```
{
  "server_host": "localhost",
  "server_port": "8080"
}
```

6. In order to start the **server** and **client** application, type the following command for each:
```bash
npm start
```
7. The live development website runs on http://localhost:3000

## Resources used
- [React](https://react.dev/)
- [Node.js](https://nodejs.org/en)
- [Leaflet](https://leafletjs.com/)
- [Leaflet-react](https://react-leaflet.js.org/)
- [MUI Components](https://mui.com/components/)
- [Responsive App Bar](https://github.com/mui/material-ui/blob/v5.11.16/docs/data/material/components/app-bar/ResponsiveAppBar.js)
- [Sticky Footer](https://github.com/mui/material-ui/tree/v5.11.16/docs/data/material/getting-started/templates/sticky-footer)

## Contributors 
- Daniela Garcia
- Kyle Florence 
- Thumpasery George
- Yuxuan Jin
