const exprress = require('express');
const got = require('got');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = exprress();
const PORT = process.env.PORT || 8081;
const thirdPartyBaseUrl = 'http://api.weatherbit.io/v2.0/current';
const thirdPertyApiKey = process.env.WEATHER_API_KEY;

app.use(cors());
app.use(exprress.json());
app.use(morgan('tiny'));

app.get('/api/weather', async (req, res) => {
	try {
		const { latitude, longitude } = req.query;

		if (!latitude) {
			return res.status(400).json({ message: 'latitude patametr is required' });
		}

		if (!longitude) {
			return res
				.status(400)
				.json({ message: 'longitude patametr is required' });
		}

		const response = await got(thirdPartyBaseUrl, {
			searchParams: {
				key: thirdPertyApiKey,
				lat: latitude,
				lon: longitude,
			},
			responseType: 'json',
		});

		const [weatherData] = response.body.data;
		const {
			city_name: cityName,
			weather: { description },
			temp,
		} = weatherData;

		res.json({ cityName, description, temp });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.listen(PORT, (err) => {
	if (err) {
		console.log('Error at server launch', err);
		return;
	}

	console.log(`Server works on ${PORT} port`);
});
