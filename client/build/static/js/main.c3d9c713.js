/*! For license information please see main.c3d9c713.js.LICENSE.txt */
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,zs=Ln`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,Hs=Ln`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,Vs=(0,rn.Ay)("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),Ys=(0,rn.Ay)(Us,{name:"MuiTouchRipple",slot:"Ripple"})`
  opacity: 0;
  position: absolute;

  &.${js.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${Gs};
    animation-duration: ${550}ms;
    animation-timing-function: ${e=>{let{theme:t}=e;return t.transitions.easing.easeInOut}};
  }

  &.${js.ripplePulsate} {
    animation-duration: ${e=>{let{theme:t}=e;return t.transitions.duration.shorter}}ms;
  }

  & .${js.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${js.childLeaving} {
    opacity: 0;
    animation-name: ${zs};
    animation-duration: ${550}ms;
    animation-timing-function: ${e=>{let{theme:t}=e;return t.transitions.easing.easeInOut}};
  }

  & .${js.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${Hs};
    animation-duration: 2500ms;
    animation-timing-function: ${e=>{let{theme:t}=e;return t.transitions.easing.easeInOut}};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
//# sourceMappingURL=main.c3d9c713.js.map