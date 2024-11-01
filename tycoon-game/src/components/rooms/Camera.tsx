import React, { useState, useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Container } from '@pixi/react';

interface Boundary {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CameraProps {
  position: { x: number; y: number };
  viewport: { width: number; height: number };
  children: React.ReactNode;
  onZoomChange?: (newZoom: number) => void;
  boundary?: Boundary;
  onBoundaryExceed?: (correctedPosition: { x: number; y: number }) => void;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
}

const Camera: React.FC<CameraProps> = ({
  position,
  viewport,
  children,
  onZoomChange,
  boundary,
  onBoundaryExceed,
  minZoom = 0.1,
  maxZoom = 5,
  initialZoom = 1,
}) => {
  let clampedInitialZoom = Math.max(minZoom, Math.min(maxZoom, initialZoom));

  if (boundary) {
    const cameraWorldSize = {
      width: viewport.width / clampedInitialZoom,
      height: viewport.height / clampedInitialZoom,
    };

    if (
      cameraWorldSize.width > boundary.width ||
      cameraWorldSize.height > boundary.height
    ) {
      const widthRatio = boundary.width / viewport.width;
      const heightRatio = boundary.height / viewport.height;
      clampedInitialZoom = 1 / Math.min(widthRatio, heightRatio);
    }
  }

  const [cameraBounds, setCameraBounds] = useState<{ x: number; y: number; width: number; height: number }>({
    x: position.x - viewport.width / 2,
    y: position.y - viewport.height / 2,
    width: viewport.width,
    height: viewport.height,
  });
  const [zoom, setZoom] = useState<number>(clampedInitialZoom);
  const containerRef = useRef<PIXI.Container>(null);

  const calculateCameraBounds = (position: { x: number; y: number }, zoom: number) => {
    const cameraWorldSize = {
      width: viewport.width / zoom,
      height: viewport.height / zoom,
    };

    let newBounds = {
      x: position.x - cameraWorldSize.width / 2,
      y: position.y - cameraWorldSize.height / 2,
      width: cameraWorldSize.width,
      height: cameraWorldSize.height,
    };

    let correctedPosition = { ...position };

    if (boundary) {
      const maxCameraX = boundary.x + boundary.width - cameraWorldSize.width;
      const maxCameraY = boundary.y + boundary.height - cameraWorldSize.height;

      if (newBounds.x < boundary.x) {
        correctedPosition.x = boundary.x + cameraWorldSize.width / 2;
      } else if (newBounds.x > maxCameraX) {
        correctedPosition.x = maxCameraX + cameraWorldSize.width / 2;
      }

      if (newBounds.y < boundary.y) {
        correctedPosition.y = boundary.y + cameraWorldSize.height / 2;
      } else if (newBounds.y > maxCameraY) {
        correctedPosition.y = maxCameraY + cameraWorldSize.height / 2;
      }

      newBounds = {
        x: correctedPosition.x - cameraWorldSize.width / 2,
        y: correctedPosition.y - cameraWorldSize.height / 2,
        width: cameraWorldSize.width,
        height: cameraWorldSize.height,
      };

      if (onBoundaryExceed) {
        onBoundaryExceed(correctedPosition);
      }
    }

    return newBounds;
  };

  const handleWheel = (event: WheelEvent) => {
    handleZoom(event.deltaY);
  };

  const handleZoom = (zoomDelta: number) => {
    const zoomFactor = 1.1;
    let newZoom = zoomDelta < 0 ? zoom * zoomFactor : zoom / zoomFactor;

    if (newZoom > maxZoom) {
      newZoom = maxZoom;
    } else if (newZoom < minZoom) {
      newZoom = minZoom;
    }

    if (boundary) {
      const cameraWorldSize = {
        width: viewport.width / newZoom,
        height: viewport.height / newZoom,
      };

      if (
        cameraWorldSize.width > boundary.width ||
        cameraWorldSize.height > boundary.height
      ) {
        const widthRatio = boundary.width / viewport.width;
        const heightRatio = boundary.height / viewport.height;
        newZoom = 1 / Math.min(widthRatio, heightRatio);
      }

      if (newZoom === zoom) {
        return;
      }

      const maxCameraX = boundary.x + boundary.width - cameraWorldSize.width;
      const maxCameraY = boundary.y + boundary.height - cameraWorldSize.height;

      let newBounds = {
        x: position.x - cameraWorldSize.width / 2,
        y: position.y - cameraWorldSize.height / 2,
        width: cameraWorldSize.width,
        height: cameraWorldSize.height,
      };

      let correctedPosition = { ...position };

      if (newBounds.x < boundary.x) {
        correctedPosition.x = boundary.x + cameraWorldSize.width / 2;
      } else if (newBounds.x > maxCameraX) {
        correctedPosition.x = maxCameraX + cameraWorldSize.width / 2;
      }

      if (newBounds.y < boundary.y) {
        correctedPosition.y = boundary.y + cameraWorldSize.height / 2;
      } else if (newBounds.y > maxCameraY) {
        correctedPosition.y = maxCameraY + cameraWorldSize.height / 2;
      }

      newBounds = {
        x: correctedPosition.x - cameraWorldSize.width / 2,
        y: correctedPosition.y - cameraWorldSize.height / 2,
        width: cameraWorldSize.width,
        height: cameraWorldSize.height,
      };

      setCameraBounds(prevBounds => {
        if (
          prevBounds.x !== newBounds.x ||
          prevBounds.y !== newBounds.y ||
          prevBounds.width !== newBounds.width ||
          prevBounds.height !== newBounds.height
        ) {
          return newBounds;
        }
        return prevBounds;
      });
    }

    if (newZoom !== zoom) {
      setZoom(newZoom);
      if (onZoomChange) {
        onZoomChange(newZoom);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.interactive = true;
      container.on('wheel', handleWheel);
    }

    return () => {
      if (container) {
        container.off('wheel', handleWheel);
      }
    };
  }, [zoom, position]);

  useEffect(() => {
    const newBounds = calculateCameraBounds(position, zoom);
    setCameraBounds(prevBounds => {
      if (
        prevBounds.x !== newBounds.x ||
        prevBounds.y !== newBounds.y ||
        prevBounds.width !== newBounds.width ||
        prevBounds.height !== newBounds.height
      ) {
        return newBounds;
      }
      return prevBounds;
    });
  }, [position, zoom]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleZoom(1);
    }, 1);

    return () => clearTimeout(timeoutId);
  }, [viewport]);

  const currentCameraPosition = {
    x: cameraBounds.x * zoom,
    y: cameraBounds.y * zoom,
  };

  return (
    <Container
      ref={containerRef}
      width={viewport.width}
      height={viewport.height}
      position={new PIXI.Point(-currentCameraPosition.x, -currentCameraPosition.y)}
      scale={new PIXI.Point(zoom, zoom)}
    >
      {children}
    </Container>
  );
};

export default Camera;
