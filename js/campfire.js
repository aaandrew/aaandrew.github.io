'use strict';

let stringToDom = (domString) => {
  let wrapper = document.createElement('div');
  wrapper.innerHTML = domString;
  return wrapper.firstChild;
};

let getFlameBounds = () => {
  // getBoundingClientRect gives dimensions that are not correct (too large)
  let flameBoundRect = $('.campfire-flame')[0].getBoundingClientRect();

  return flameBoundRect;
}

let scale = 5;

let logoPieces = [{
  x: 0,
  y: 0,
  width: 3,
  height: 25
}, {
  x: 5,
  y: 4,
  width: 3,
  height: 30
}, {
  x: 10,
  y: 4,
  width: 3,
  height: 30
}, {
  x: 15,
  y: 4,
  width: 3,
  height: 21
}];

let logoFirePlacePieces = [{
  x: 6,
  y: 28,
  width: 3,
  height: 15,
  rotation: 45
}, {
  x: 7,
  y: 24,
  width: 2,
  height: 20,
  rotation: 75
}, {
  x: 8,
  y: 24,
  width: 2,
  height: 20,
  rotation: -75
}, {
  x: 10,
  y: 31,
  width: 2,
  height: 11,
  rotation: -45
}];

let tl = new TimelineMax({
  delay: 0.5
});
// Get all of the initial sizes and elements ready
// Trick from: http://greensock.com/forums/topic/10332-update-tween-value-while-its-tweening/?p=41243
tl
  .seek(0)
  .invalidate();
/* * /
setTimeout(function() {
  tl
    //.seek(0)
    .seek('campfire-flame')
    //.stop();
}, 0);
/* */

$('.js-restart').on('click', () => {
  tl.restart();
});

let gitterBackgroundStageNode = $('.gitter-background-stage')[0];
let nighttimeBackgroundStageNode = $('.nighttime-background-stage')[0];
tl
  .set(
    nighttimeBackgroundStageNode, {
      autoAlpha: 0
    },
    0
  );

// Create the campfire flame
let campfireWrapperNode = $('.campfire-wrapper')[0];

let flameNode = stringToDom('<svg class="campfire-flame" viewBox="0 0 216 348"><use xlink:href="#svg-flame"></use></svg>');
// Create the campfire flame glow
let flameGlowNode = stringToDom('<div class="campfire-flame-glow"></div>');

let flamePieceNodes = [flameNode, flameGlowNode];

campfireWrapperNode.appendChild(flameGlowNode);
campfireWrapperNode.appendChild(flameNode);

tl
  .set(
    flameNode, {
      width: `${40.5 * scale}px`
    },
    0
  );

tl
  .set(
    flameGlowNode, (() => {
      let flameBounds = getFlameBounds();
      let flameGlowWidth = 3 * getFlameBounds().width;
      let flameGlowHeight = 3 * getFlameBounds().height;

      return {
        width: `${flameGlowWidth}px`,
        height: `${flameGlowHeight}px`,
        x: `${(-flameGlowWidth / 2) + (flameBounds.width / 2)}px`,
        y: `${(-flameGlowHeight / 2) + ( 0.5 * flameBounds.height)}px`
      };
    })(),
    0
  );



// Create the Gitter logo pieces
let logoPieceNodes = [];
logoPieces.forEach((logoPiece) => {
  let barNode = document.createElement('div');
  barNode.classList.add('gitter-logo-bar');
  logoPieceNodes.push(barNode);

  $('.gitter-logo-wrapper').forEach((logoWrapperNode) => {
    logoWrapperNode.appendChild(barNode);
  });

  tl
    .set(
      barNode, {
        width: `${logoPiece.width * scale}px`,
        height: `${logoPiece.height * scale}px`,
        x: `${logoPiece.x * scale}px`,
        y: `${logoPiece.y * scale}px`
      },
      0
    );
});

// Create the Gitter Logo Text
let logoTextWrapperNode = $('.gitter-logo-text-wrapper')[0];
let logoNameNode = $('.gitter-logo-name')[0];
let logoNameLinkNode = $('.gitter-logo-name-link')[0];
let logoTaglineNode = $('.gitter-logo-tagline')[0];
let logoExploreLinkNode = $('.gitter-go-explore-link')[0];
let logoLetterNodes = [];

let logoText = logoNameLinkNode.textContent;
// Clear out the text
logoNameLinkNode.innerHTML = '';
// And replace it with individually wrapped letters
Array.prototype.forEach.call(logoText, function(logoLetter) {
  let letterNode = stringToDom(`<span class="gitter-logo-name-letter">${logoLetter}</span>`);
  logoLetterNodes.push(letterNode);
  logoNameLinkNode.appendChild(letterNode);
});

// Move it to the right of the logo/fire
tl
  .set(
    logoTextWrapperNode, {
      left: `${getFlameBounds().width}px`
    },
    0
  );

// Set the proper font size
tl
  .set(
    logoNameNode, {
      fontSize: `${18 * scale}px`
    },
    0
  )
  .set(
    logoTaglineNode, {
      fontSize: `${6 * scale}px`
    },
    0
  )
  .set(
    logoExploreLinkNode, {
      fontSize: `${5 * scale}px`
    },
    0
  );

// Fall into the Gitter Logo
// ---------------------------------
tl.addLabel('gitterLogoFallStart');
logoPieceNodes.forEach((logoPieceNode, pieceIndex) => {
  let logoPiece = logoPieces[pieceIndex];

  tl
    .from(
      logoPieceNode,
      0.5, {
        y: '-200px',
        autoAlpha: 0,
        ease: Bounce.easeOut
      },
      `gitterLogoFallStart+=${0.05 * pieceIndex}`
    )
    .addLabel(`gitterLogoBarFallDone${pieceIndex}`);
});
// Add a small pause at the end
tl.set({}, {}, '+=0.8');

// Animate the Gitter text in
tl
  .staggerFrom(
    logoLetterNodes,
    0.1, {
      y: '50px',
      autoAlpha: 0
    },
    0.05,
    'gitterLogoFallStart'
  );

// Gitter logo falls into the campfire logs
// ---------------------------------
tl.addLabel('gitterLogoFallIntoLogsStart');
logoPieceNodes.forEach((logoPieceNode, pieceIndex) => {
  let logoPiece = logoFirePlacePieces[pieceIndex];

  tl
    .to(
      logoPieceNode,
      0.5, {
        x: `${logoPiece.x * scale}px`,
        y: `${logoPiece.y * scale}px`,
        rotation: `${logoPiece.rotation}px`,
        backgroundColor: 'rgba(53, 49, 40, 1)',
        ease: Bounce.easeOut
      },
      `gitterLogoFallIntoLogsStart+=${0.05 * pieceIndex}`
    );
});

// Fade in the nighttime
tl
  .to(
    nighttimeBackgroundStageNode,
    1, {
      autoAlpha: 1,
      ease: Power4.easeOut
    },
    'gitterLogoFallIntoLogsStart+=0'
  );

// Flame appears on campfire
// ---------------------------------

// Set up looping flame flicker
let campfireScaleXTl = new TimelineMax({
  repeat: -1,
  paused: true
});
campfireScaleXTl
  .fromTo(
    flamePieceNodes,
    2, {
      scaleX: 0.9,
      transformOrigin: '50% 100%'
    }, {
      scaleX: 1,
      transformOrigin: '50% 100%',
      ease: RoughEase.ease
    }
  )
  .to(
    flamePieceNodes,
    2, {
      scaleX: 0.9,
      transformOrigin: '50% 100%',
      ease: RoughEase.ease.config({
        strength: 1.0
      })
    }
  );

let campfireScaleYTl = new TimelineMax({
  repeat: -1,
  paused: true
});
campfireScaleYTl
  .fromTo(
    flamePieceNodes,
    2, {
      scaleY: 1.1,
      transformOrigin: '50% 100%',
      ease: RoughEase.ease
    }, {
      scaleY: 0.9,
      transformOrigin: '50% 100%',
      ease: RoughEase.ease.config({
        strength: 1.5
      })
    }
  )
  .to(
    flamePieceNodes,
    2, {
      scaleY: 1.1,
      transformOrigin: '50% 100%',
      ease: RoughEase.ease
    }
  );

// Make flame appear
let getFlamePositionY = () => {
  return ((logoFirePlacePieces[3].y + 6) * scale) - getFlameBounds().height;
};
tl
  .set(
    campfireWrapperNode, {
      x: `${-3 * scale}px`,
      y: `${getFlamePositionY() + (4 * scale)}px`,
      autoAlpha: 0
    },
    0
  )
  .addLabel('campfire-flame')
  .to(
    campfireWrapperNode,
    1, {
      y: `${getFlamePositionY()}px`,
      autoAlpha: 1,
      ease: Power3.easeOut,
      onStart: function() {
        // Start the flame flicker infinite loop
        campfireScaleXTl.restart();
        campfireScaleYTl.restart();
      }
    },
    'campfire-flame-=0.25'
  )
  .addLabel('campfire-flame-ignite');

// Slide in the tagline
tl
  .fromTo(
    logoTaglineNode,
    0.5, {
      x: -10 * scale,
      scale: 1.3,
      autoAlpha: 0
    }, {
      x: 5 * scale,
      scale: 1,
      autoAlpha: 1,
      ease: Power4.easeOut
    },
    'campfire-flame-=0.25'
  );

// Embers appear on campfire
// ---------------------------------
tl.addLabel('ember-start');

// Set up looping ember appear
let emberTl = new TimelineMax({
  repeat: -1,
  paused: true
});

// Start the ember loop going
tl
  .add(function() {
    emberTl.restart();
  });

// After a little while transition in the call to action
let getExploreLinkOffset = () => {
  let documentBounds = document.body.getBoundingClientRect();
  let exploreLinkBounds = logoExploreLinkNode.getBoundingClientRect();

  let exploreLinkTopOffset = 20 * scale;

  let overflow = (exploreLinkTopOffset + (exploreLinkBounds.top + exploreLinkBounds.height)) - documentBounds.height;

  console.log(exploreLinkTopOffset, overflow, ':', documentBounds.height, exploreLinkBounds.top, '+', exploreLinkBounds.height);
  if (overflow > 0) {
    exploreLinkTopOffset -= overflow;
  }

  return exploreLinkTopOffset;
}
let exploreLinkOffset = getExploreLinkOffset();
tl
  .set(
    logoExploreLinkNode, (() => {
      return {
        y: exploreLinkOffset + (10 * scale),
        autoAlpha: 0
      };
    })(),
    0
  )
  .to(
    logoExploreLinkNode,
    0.1, {
      y: exploreLinkOffset,
      autoAlpha: 1,
      ease: Back.easeOut.config(1.7)
    },
    'ember-start+=0.5'
  );