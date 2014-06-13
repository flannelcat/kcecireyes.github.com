scaledTotal <- (846000 / 2000)

manhattan <- scaledTotal*0.273
brooklyn <- scaledTotal*0.367
bronx <- scaledTotal*0.048
staten_Island <- scaledTotal*0.089
queens <- scaledTotal*0.223

a <- scaledTotal*0.057
b <- scaledTotal*0.143
c <- scaledTotal*0.259
d <- scaledTotal*0.137
e <- scaledTotal*0.26
f <- scaledTotal*0.145

Extreme_Poverty <- scaledTotal*0.073
Below_poverty_threshold <- scaledTotal*0.10
near_poor <- scaledTotal*0.047
above_poor <- scaledTotal*(0.047+0.056+0.024+0.653)

White <- scaledTotal*0.455
Black <- scaledTotal*0.23
Hispanic <- scaledTotal*0.21
Asian <- scaledTotal*0.09
Multiracial <- scaledTotal*0.015

Non_institutionalized <- scaledTotal*0.113
non_Disabled <- scaledTotal*0.887

nonin <- data.frame(matrix(0, ncol = 5, nrow = Non_institutionalized))
nondis <- data.frame(matrix(0, ncol = 5, nrow = non_Disabled))

nonin[1:(Non_institutionalized+1), 5] <- c("Non_institutionalized")
nondis[1:non_Disabled, 5] <- c("Not_disabled")

disData <- rbind(nondis, nonin)
disData$id <- 1:423

man <- data.frame(matrix(0, ncol = 5, nrow = manhattan))
broo <- data.frame(matrix(0, ncol = 5, nrow = brooklyn))
bro  <- data.frame(matrix(0, ncol=5, nrow = bronx))
que <- data.frame(matrix(0, ncol=5, nrow = queens))
si  <- data.frame(matrix(0, ncol=5, nrow = staten_Island))

man[1:(manhattan), 1] <- c("manhattan")
broo[1:(brooklyn), 1] <- c("brooklyn")
bro[1:(bronx), 1] <- c("bronx")
que[1:(queens+1), 1] <- c("queens")
si[1:(staten_Island+1), 1] <- c("staten_Island")

boroData <- rbind(man,broo)
boroData <- rbind(boroData, bro)
boroData <- rbind(boroData, que)
boroData <- rbind(boroData, si)
boroData$id <- 1:423

under <- data.frame(matrix(0, ncol = 5, nrow = a))
five <- data.frame(matrix(0, ncol = 5, nrow = b))
eight  <- data.frame(matrix(0, ncol=5, nrow = c))
thirty <- data.frame(matrix(0, ncol=5, nrow = d))
forty  <- data.frame(matrix(0, ncol=5, nrow = e))
sixty <- data.frame(matrix(0, ncol=5, nrow = f))

under[1:a, 2] <- c("Under5")
five[1:b, 2] <- c("5to17")ne
eight[1:(c+1), 2] <- c("18to34")
thirty[1:(d+1), 2] <- c("35to44")
forty[1:(e+1), 2] <- c("45to64")
sixty[1:f, 2] <- c("65andolder")

ageData <- rbind(under,five)
ageData <- rbind(ageData, eight)
ageData <- rbind(ageData, thirty)
ageData <- rbind(ageData, forty)
ageData <- rbind(ageData, sixty)
ageData$id <- 1:423

extreme <- data.frame(matrix(0, ncol = 5, nrow = Extreme_Poverty))
below <- data.frame(matrix(0, ncol = 5, nrow = Below_poverty_threshold))
near  <- data.frame(matrix(0, ncol=5, nrow = near_poor))
above <- data.frame(matrix(0, ncol=5, nrow = above_poor))

extreme[1:(Extreme_Poverty+1), 3] <- c("extreme_poverty")
below[1:Below_poverty_threshold, 3] <- c("below_poverty")
near[1:(near_poor+1), 3] <- c("near_poor")
above[1:(above_poor+1), 3] <- c("above_poor")

povData <- rbind(extreme,below)
povData <- rbind(povData, near)
povData <- rbind(povData, above)
povData$id <- 1:423

white <- data.frame(matrix(0, ncol = 5, nrow = White))
black <- data.frame(matrix(0, ncol = 5, nrow = Black))
hispanic  <- data.frame(matrix(0, ncol=5, nrow = Hispanic))
asian <- data.frame(matrix(0, ncol=5, nrow = Asian))
multi <- data.frame(matrix(0, ncol=5, nrow = Multiracial))
na <- data.frame(matrix(0, ncol=5, nrow = 4))

white[1:(White+1), 4] <- c("white")
black[1:Black, 4] <- c("black")
hispanic[1:(Hispanic), 4] <- c("Hispanic")
asian[1:(Asian+1), 4] <- c("Asian")
multi[1:(Multiracial), 4] <- c("Multiracial")

raceData <- rbind(white,black)
raceData <- rbind(raceData, hispanic)
raceData <- rbind(raceData, asian)
raceData <- rbind(raceData, multi)
raceData$id <- 1:423

newData <- cbind(ageData[,2], raceData[,4])
newData <- cbind(newData, povData[,3])
newData <- cbind(newData, boroData[,1])
newData <- cbind(newData, disData[,5])

# print(newData)
