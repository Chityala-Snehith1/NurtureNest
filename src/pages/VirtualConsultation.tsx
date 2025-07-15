import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, CircularProgress, Grid, Card, CardContent } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

// Simulating fetching available slots (You would replace this with a real API call)
const availableSlots = [
  '10:00 AM - 10:30 AM',
  '11:00 AM - 11:30 AM',
  '01:00 PM - 01:30 PM',
  '02:00 PM - 02:30 PM',
  '03:00 PM - 03:30 PM',
];

const VirtualConsultation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState(availableSlots);

  useEffect(() => {
    setIsLoading(true);
    // Simulate an API call to fetch available slots
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleBooking = (values: { selectedSlot: string }) => {
    // Simulate a booking action (API call to save data would go here)
    alert(`You have booked a consultation for: ${values.selectedSlot}`);
    navigate('/consultations/virtual'); // Navigate to a confirmation or success page
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Virtual Consultation
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Choose an available time slot for your virtual consultation. 
        Please select a time that works best for you.
      </Typography>

      {isLoading ? (
        <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Formik
          initialValues={{ selectedSlot: '' }}
          validationSchema={Yup.object({
            selectedSlot: Yup.string().required('Please select a time slot'),
          })}
          onSubmit={handleBooking}
        >
          <Form>
            {error && <Typography color="error" align="center">{error}</Typography>}
            <Grid container spacing={2} justifyContent="center">
              {slots.map((slot, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    style={{
                      cursor: 'pointer',
                      border: '2px solid #ddd',
                      transition: '0.3s',
                      backgroundColor: '#fafafa',
                    }}
                    onClick={() => setError(null)} // Clear error when user selects a slot
                  >
                    <CardContent>
                      <Typography variant="h6" align="center">{slot}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Field
              name="selectedSlot"
              component={TextField}
              select
              label="Select a Time Slot"
              variant="outlined"
              fullWidth
              style={{ marginTop: '20px' }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="" label="Select a slot" />
              {slots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </Field>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Book Consultation
              </Button>
            </div>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default VirtualConsultation;
