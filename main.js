let pool=2;
let reroll=10;
let rolls;
let sums;
let sum_mode=false;
let max_mode=false;

let unit;
let b_down=false;

const limit=5;
const chart_len=30;

function setup()
{
	createCanvas(windowWidth,windowHeight);
	unit=min(width/100,height/50);
  background(0);
  stroke(255);
  fill(100)
  colorMode(HSB,255);
  rolls=Array();
  sums=Array();
  textAlign(BOTTOM,LEFT)

	generate();
}

function draw()
{
	background(0);
	textSize(2.2*unit);
	for(let i=1;i<=5;i++)
	{
		if(i==pool) fill(200,100,200);
		else	fill(100);
		noStroke();
		if(b_rect(0,8*unit*i,5*unit,4*unit))
		{	
			pool=i;
			generate();
		}
		fill(0);
		text(i,1*unit,8*unit*i+3*unit)
	}
  	
  	for(let i=2;i<=11;i++)
	{
		if(i==reroll) fill(200,100,200);
		else	fill(100);
		noStroke();
		if(b_rect(8*unit*(i-1),0,4*unit,4*unit))
		{	
			reroll=i;
			generate();
		}
		fill(0);
		if(i<11)
			text(i,8*unit*(i-1)+1*unit,3*unit)
		else
			text('--',8*unit*(i-1)+1*unit,3*unit)
	}

	if(sum_mode)
	{
		fill(200,100,200)
		if(b_rect(90*unit,10*unit,5*unit,5*unit))
		{	
			sum_mode=false;
			generate();
		}
		fill(0);
		text(" >=",90*unit,14*unit)
	}
	else
	{
		fill(100);
		if(b_rect(90*unit,10*unit,5*unit,5*unit))
		{	
			sum_mode=true;
			generate();
		}
		fill(0);
		text("  =",90*unit,14*unit)
	}
	if(max_mode)
	{
		fill(200,100,200)
		if(b_rect(90*unit,17*unit,5*unit,5*unit))
		{	
			max_mode=false;
			generate();
		}
		fill(0);
		text("MAX",90*unit,21*unit)
	}
	else
	{
		fill(100);
		if(b_rect(90*unit,17*unit,5*unit,5*unit))
		{	
			max_mode=true;
			generate();
		}
		fill(0);
		text("SUM",90*unit,21*unit)
	}


	if(sum_mode)
		chart(sums,10*unit,80*unit,8*unit,40*unit,chart_len);
	else
		chart(rolls,10*unit,80*unit,8*unit,40*unit,chart_len);
}

function chart(values,x1,x2,y1,y2,rx)
{
	textSize(1.6*unit);
	noStroke();
	for(let i=1;i<=rx;i++)
	{	
		let h=map(values[i],0,100,0,y2-y1);
		fill(150);
		rect(x1+(x2-x1)/rx*(i-1),y2-h,(x2-x1)/rx,h);
		fill(0);
		text(i,x1+(x2-x1)/rx*(i-1),y2);
	}
	stroke(255);
	fill(255);
	for(let i=0;i<=100;i+=10)
	{
		let h=(y2-y1)/100*i;
		if(i==50) stroke(100,100,255);
		line(x1,y2-h,x2+10,y2-h);
		stroke(255);
		text(i,x2+10,y2-h);
	}
}

function roll()
{
	let result=Math.floor(random(1,11));
	if(result>=reroll) 
		return result+roll();
	else
		return result;
}

function roll_pool()
{
	let result=0;
	if(!max_mode)
	{
		for(let i=0;i<pool;i++)
			result+=roll();
	}else
	{
		for(let i=0;i<pool;i++)
		{
			let r=roll()
			if(result<r) result=r;
		}	
	}
	return result;
}

function generate()
{
	for(let i=0;i<=30;i++)
		rolls[i]=0;
	for(let i=0;i<=100000;i++)
		rolls[min(30,roll_pool())]+=0.001;

	for(let i=0;i<=30;i++)
	{
		sums[i]=0;
		for(let j=i;j<rolls.length;j++)
			sums[i]+=rolls[j];
	}
}

function keyPressed()
{
  //println(keyCode);
  if(keyCode==32) {background(0);}
  if(keyCode===LEFT_ARROW) if(reroll>2) reroll--;
  if(keyCode===RIGHT_ARROW) if(reroll<11) reroll++;
  if(keyCode===UP_ARROW) if(pool>1) pool--;
  if(keyCode===DOWN_ARROW) if(pool<5) pool++;
  if(keyCode===ENTER) sum_mode=!sum_mode;
  if(keyCode===CONTROL) max_mode=!max_mode;

  generate();
}

function b_rect(x,y,w,h)
{
	rect(x,y,w,h);
	if(mouseX>x && mouseX<x+w && mouseY>y && mouseY<y+h)
		if(mouseIsPressed)
			if(!b_down)
			{
				b_down=true;
				return true;
			}
	if(!mouseIsPressed)
		b_down=false;
	return false;
}