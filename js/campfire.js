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

let scale = 10;

let logoPieces = [{
  x: 0,
  y: 0,
  width: 2,
  height: 15
}, {
  x: 5,
  y: 4,
  width: 2,
  height: 20
}, {
  x: 10,
  y: 4,
  width: 2,
  height: 20
}, {
  x: 15,
  y: 4,
  width: 2,
  height: 11
}];

let logoFirePlacePieces = [{
  x: 6,
  y: 28,
  width: 2,
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

// Gitter fuels all of these communities
// https://avatars.githubusercontent.com/jspm?s=30
let projectUsernames = [
  'jspm',
  'postcss',
  'marionettejs',
  'babel',
  'nodejs',
  'angular',
  'webpack',
  'meteor',
  'rails',
  'strongloop',
  'emberjs',
  'scala-js',
  'adobe',
  'cdnjs',
  'gulpjs',
  'nodegit',
  'cakephp',
  'magento',
  'joomla',
  'travis-ci',
  'esp8266',
  'django',
  'atom'
];

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
      width: `${22.5 * scale}px`
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

// Create the campfire embers
let projectEmberNodes = [];
projectUsernames.forEach((projectUsername) => {
  let imageNode = stringToDom(`<img class="logo-ember" src="https://avatars.githubusercontent.com/${projectUsername}?s=${12 * scale}">`);
  projectEmberNodes.push(imageNode);

  campfireWrapperNode.appendChild(imageNode);
});

// Create the Gitter logo pieces
let logoPieceNodes = [];
logoPieces.forEach((logoPiece) => {
  let barNode = document.createElement('div');
  barNode.classList.add('gitter-logo-bar');
  logoPieceNodes.push(barNode);

  $('.gitter-logo-wrapper').each(function(logoWrapperNode){
    $(this).append(barNode);
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
let logoTaglineNode = $('.gitter-logo-tagline')[0];
let logoExploreLinkNode = $('.gitter-go-explore-link')[0];
let logoLetterNodes = [];


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


// Embers appear on campfire
// ---------------------------------
tl.addLabel('ember-start');

// Set up looping ember appear
let emberTl = new TimelineMax({
  repeat: -1,
  paused: true
});

projectEmberNodes.forEach((emberNode, emberIndex) => {
  emberTl
    .fromTo(
      emberNode,
      0.5, (() => {
        let flameBounds = getFlameBounds();

        return {
          top: Math.random() * (0.5 * flameBounds.height) + (0.25 * flameBounds.height),
          left: Math.random() * flameBounds.width - (emberNode.getBoundingClientRect().width / 2),
          scale: 0.8,
          autoAlpha: 0
        };
      })(), {
        scale: 1,
        autoAlpha: 1
      },
      `emberFadeIn${emberIndex}`
    )
    .to(
      emberNode,
      1, {
        top: '0px',
        ease: SlowMo.ease.config(0.5, 0.4, false)
      },
      `emberFadeIn${emberIndex}+=0`
    )
    .to(
      emberNode,
      0.25, {
        autoAlpha: 0
      },
      '-=0.25'
    );
});
// Start the ember loop going
tl
  .add(function() {
    emberTl.restart();
  });