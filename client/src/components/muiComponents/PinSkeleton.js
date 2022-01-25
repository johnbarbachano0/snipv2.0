import React from "react";
import { Box, Card, Grid, Skeleton } from "@mui/material";

function PinSkeleton() {
  const skeleton = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <Box margin={5} marginTop={8}>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="stretch"
        spacing={2}
      >
        {skeleton.map((item) => {
          return (
            <Grid item xs={12} sm={6} md={4} xl={3} key={item}>
              <Card sx={{ padding: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={50}
                    height={50}
                    sx={{ marginTop: 0.5, marginBottom: 0.5, marginRight: 0.5 }}
                  />
                  <Skeleton animation="wave" variant="text" width={"100%"} />
                </Box>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={"100%"}
                  height={40}
                  sx={{ borderRadius: 1.5 }}
                />
                <Skeleton animation="wave" variant="text" width={"100%"} />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default PinSkeleton;
